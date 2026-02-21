# Build and Deployment Process

## Overview

The ST_CurrencyApi project uses Ant-based build automation to compile InfoBasic code, run tests, and package components for deployment to T24/Transact systems.

---

## Component Directory Structure

Each component follows a standard directory layout:

```
ComponentName/
├── Definition/                         ;* Component Isolation Definitions
│   └── ST.ComponentName.component      ;* API method and structure definitions
│
├── Source/
│   ├── Private/                        ;* Internal implementation
│   │   ├── ST.ROUTINE.NAME_01.b       ;* Business logic
│   │   ├── ST.ROUTINE.NAME_02.b
│   │   └── (other private routines)
│   │
│   └── Public/                         ;* Public-facing subroutines
│       ├── ST.PUBLIC.ROUTINE.b
│       └── (exported subroutines)
│
├── Data/
│   └── Public/                         ;* Data structure definitions
│       ├── ST.STRUCTURE.NAME.d        ;* Record layout definitions
│       └── (other data definitions)
│
├── Test/
│   ├── UnitTests/                      ;* UTF (Unit Test Framework)
│   │   ├── ST.ROUTINE.NAME_01.tut
│   │   ├── ST.ROUTINE.NAME_02.tut
│   │   └── (test cases)
│   │
│   └── Integration/                    ;* Java integration tests
│       └── (Java test files)
│
├── HelpText/                           ;* XML help documentation
│   └── (help content files)
│
├── build.xml                           ;* Ant build configuration
├── build.properties                    ;* Build settings
└── version.xml                         ;* Version information
```

---

## Build Files

### build.xml

Main Ant build file that defines build targets and dependencies.

**Key Targets:**

```xml
<project name="ST_CurrencyApi" default="build" basedir=".">

    <!-- Properties -->
    <property file="build.properties"/>

    <!-- Compilation target -->
    <target name="compile" description="Compile InfoBasic source">
        <exec executable="jbc">
            <arg value="-J"/>
            <arg line="Source/Private/*.b"/>
        </exec>
    </target>

    <!-- Build target (compile + package) -->
    <target name="build" depends="compile" description="Build component">
        <jar destfile="dist/ST_CurrencyApi.jar">
            <fileset dir="Source/"/>
            <fileset dir="Definition/"/>
            <manifest>
                <attribute name="Implementation-Version" value="${version}"/>
            </manifest>
        </jar>
    </target>

    <!-- Test target -->
    <target name="test" depends="compile" description="Run unit tests">
        <exec executable="jtest">
            <arg value="Test/UnitTests/*.tut"/>
        </exec>
    </target>

    <!-- Clean target -->
    <target name="clean" description="Remove build artifacts">
        <delete dir="dist"/>
        <delete dir="obj"/>
    </target>
</project>
```

### build.properties

Configuration properties for the build process.

```properties
# Component identification
component.name=ST_CurrencyApi
component.version=1.0.0
component.package=ST.CurrencyApi

# Build settings
jbc.compiler=jbc
jbc.options=-J
target.java.version=1.8

# Paths
src.dir=Source
build.dir=build
dist.dir=dist
test.dir=Test

# Dependencies
lib.dir=lib
jbo.dir=jbo
```

### version.xml

Version and metadata information.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<component>
    <name>ST_CurrencyApi</name>
    <version>1.0.0</version>
    <description>Currency Exchange Rate API</description>
    <author>Development Team</author>
    <created>2025-01-15</created>
    <dependencies>
        <component>ST_CurrencyConfig</component>
        <component>ST_CurrencyExchangeService</component>
    </dependencies>
</component>
```

---

## Build Commands

### Build entire project

```bash
cd /path/to/transact-skill
ant build
```

Compiles all components and creates distribution packages.

### Build individual component

```bash
cd ST_CurrencyApi
ant build
```

Builds only the ST_CurrencyApi component.

### Compile without packaging

```bash
ant compile
```

Compiles source code without creating distribution JAR. Useful for quick compilation checks.

### Run tests

```bash
ant test
```

Runs all unit tests in Test/UnitTests/ directory using jtest framework.

### Clean build artifacts

```bash
ant clean
```

Removes all build output, compiled files, and artifacts.

### Full rebuild (clean + build + test)

```bash
ant clean build test
```

Complete fresh build with testing.

---

## Component Compilation Process

### Phase 1: Compilation

```
Source Files (.b, .component, .d)
    ↓
jBC Compiler (jbc -J ...)
    ↓
Compiled Classes (.class, .obj)
    ↓
Object Directory (obj/)
```

**What Gets Compiled:**

- Source/Private/\*.b - Private implementation subroutines
- Source/Public/\*.b - Public API routines
- Definition/\*.component - Component isolation definitions
- Data/Public/\*.d - Data structure definitions

**Output:**

- Compiled class files
- Symbol tables
- Component metadata

### Phase 2: Packaging

```
Compiled Classes
    ↓
Jar/War Creation
    ↓
Distribution Archive
    ↓
dist/ Directory
```

**Artifacts Created:**

- ST_CurrencyApi.jar - Main component JAR
- ST_CurrencyApi-sources.jar - Source code JAR
- ST_CurrencyApi-javadoc.jar - Documentation JAR

### Phase 3: Testing

```
Test Files (.tut)
    ↓
UTF Framework (jtest)
    ↓
Test Results
    ↓
Pass/Fail Report
```

---

## Component Dependencies

Components can depend on other components. The build system manages these dependencies.

```
ST_CurrencyApi (depends on)
├─ ST_CurrencyConfig (provides DAS layer)
└─ ST_CurrencyExchangeService (provides business logic)
    └─ (may depend on other components)
```

**Dependency Declaration** (in version.xml or build.xml):

```xml
<dependencies>
    <component>ST_CurrencyConfig</component>
    <component>ST_CurrencyExchangeService</component>
</dependencies>
```

**Build Order:**

1. Resolve dependencies
2. Build dependent components first
3. Build current component with access to dependencies
4. Create distribution with all dependencies

---

## Deployment Process

### 1. Pre-Deployment

- Run complete test suite
- Verify all build artifacts created
- Check version numbers and metadata
- Review change log

### 2. Deployment

**To Development Environment:**

```bash
# Deploy component to T24 development system
t24-deploy.sh --env=dev --component=ST_CurrencyApi

# Or manually:
# 1. Copy JAR to T24_HOME/lib
# 2. Copy component definition to jbo directory
# 3. Register component in system
```

**To Production Environment:**

```bash
# Deploy with rollback capability
t24-deploy.sh --env=prod --component=ST_CurrencyApi --backup

# Requires approval/authorization
```

### 3. Post-Deployment

- Verify component installation
- Run integration tests
- Monitor system logs
- Validate API endpoints accessible
- Update documentation

---

## Continuous Integration Setup

### Jenkins Pipeline Example

```groovy
pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 1, unit: 'HOURS')
    }

    stages {
        stage('Compile') {
            steps {
                sh 'cd ST_CurrencyApi && ant compile'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'cd ST_CurrencyApi && ant test'
            }
        }

        stage('Build') {
            steps {
                sh 'cd ST_CurrencyApi && ant build'
            }
        }

        stage('Deploy to Dev') {
            when {
                branch 'develop'
            }
            steps {
                sh 't24-deploy.sh --env=dev --component=ST_CurrencyApi'
            }
        }

        stage('Integration Tests') {
            when {
                branch 'develop'
            }
            steps {
                sh 'cd ST_CurrencyApi && ant integration-test'
            }
        }

        stage('Deploy to Prod') {
            when {
                branch 'main'
            }
            input {
                message "Deploy to production?"
                ok "Deploy"
            }
            steps {
                sh 't24-deploy.sh --env=prod --component=ST_CurrencyApi --backup'
            }
        }
    }

    post {
        always {
            junit 'Test/UnitTests/**/*.xml'
            archiveArtifacts artifacts: 'dist/**/*.jar'
        }
        failure {
            emailext to: 'team@company.com',
                     subject: "Build Failed: ${env.JOB_NAME}",
                     body: "Build failed. Check ${env.BUILD_URL}"
        }
    }
}
```

---

## Build Troubleshooting

### Compilation Errors

**Missing $INSERT file:**

```
Error: cannot find file I_COMMON
```

Solution: Ensure include files are in jboPath or add to classpath.

**Method not found:**

```
Error: cannot resolve ST.ExchangeRate.CalcErateLocal
```

Solution: Ensure ST.ExchangeRate component is compiled and in classpath.

**Field equate not defined:**

```
Error: CURRENCY.CODE is undefined
```

Solution: Ensure $INSERT I_CURRENCY_FIELDS is present.

### Test Failures

**UTF stub not found:**

```
Error: Stub 'EB.API.checkEmptyParameters' not configured
```

Solution: Add UTF.ignoreMissingStubs() or configure all stubs.

**ETEXT assertion fails:**

```
Expected 'ERROR' but was ''
```

Solution: Check service call actually sets error; verify stub configuration.

### Deployment Issues

**Component version conflict:**

```
Error: Component version 1.0.0 already deployed
```

Solution: Increment version number in version.xml before deployment.

**Dependency not found:**

```
Error: Cannot find dependent component ST_CurrencyConfig
```

Solution: Ensure dependency component is deployed first.

---

## Best Practices

1. **Version Control**
   - Commit version.xml changes
   - Tag releases in git
   - Keep CHANGELOG.md updated

2. **Build Automation**
   - Run full build before commit
   - Use CI/CD for automated testing
   - Require passing tests before merge

3. **Testing**
   - Write unit tests for all routines
   - Maintain >80% code coverage
   - Test error paths, not just happy path

4. **Documentation**
   - Keep README.md current
   - Document deployment steps
   - Maintain API documentation

5. **Release Management**
   - Use semantic versioning (major.minor.patch)
   - Create release branches
   - Maintain production rollback capability

---

## Build Artifacts Summary

| Artifact     | Purpose             | Location      |
| ------------ | ------------------- | ------------- |
| \*.class     | Compiled routines   | obj/          |
| \*.jar       | Component package   | dist/         |
| -sources.jar | Source code archive | dist/         |
| -javadoc.jar | API documentation   | dist/         |
| \*.tut       | Test results        | Test/Results/ |
| build.log    | Build output log    | (console/CI)  |
