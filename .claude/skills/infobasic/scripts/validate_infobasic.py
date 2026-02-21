#!/usr/bin/env python3
"""
InfoBasic Code Validator

Validates T24 InfoBasic (.b) files against universal naming conventions, structure rules,
and anti-patterns defined in the infobasic skill.

IMPORTANT: This validator enforces UNIVERSAL patterns only (control flow, loops, strings,
file I/O, error handling). Project-specific patterns are validated by project-level validators:
- TPH service layer: See CLAUDE_TPH.md for service-specific validation
- AA Framework: See CLAUDE_AA.md for AA-specific validation

Usage:
    python validate_infobasic.py <file.b>
    python validate_infobasic.py <directory>
    python validate_infobasic.py <file.b> --strict
"""

import sys
import re
from pathlib import Path
from dataclasses import dataclass
from typing import List, Tuple, Optional
from enum import Enum


class IssueSeverity(Enum):
    """Severity levels for validation issues"""
    ERROR = "ERROR"
    WARNING = "WARNING"
    INFO = "INFO"


@dataclass
class ValidationIssue:
    """Represents a validation issue found in code"""
    severity: IssueSeverity
    line_number: int
    rule_id: str
    message: str
    code_snippet: str = ""
    suggestion: str = ""

    def __str__(self):
        return f"[{self.severity.value}] Line {self.line_number} ({self.rule_id}): {self.message}"


class InfoBasicValidator:
    """Validates InfoBasic code against conventions and rules"""

    def __init__(self, strict_mode: bool = False):
        self.strict_mode = strict_mode
        self.issues: List[ValidationIssue] = []
        self.lines: List[str] = []

    def validate_file(self, filepath: Path) -> List[ValidationIssue]:
        """Validate a single InfoBasic file"""
        if not filepath.exists():
            raise FileNotFoundError(f"File not found: {filepath}")

        if filepath.suffix.lower() != '.b':
            raise ValueError(f"Expected .b file, got: {filepath}")

        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            self.lines = f.readlines()

        self.issues = []

        # Run all validators
        self._check_structure()
        self._check_naming_conventions()
        self._check_includes()
        self._check_error_handling()
        self._check_anti_patterns()

        return self.issues

    # ===== STRUCTURE CHECKS =====

    def _check_structure(self):
        """Check basic structure: SUBROUTINE/FUNCTION definition and END statement"""
        content = ''.join(self.lines)

        # Check if it's a SUBROUTINE or FUNCTION
        is_subroutine = re.search(r'^\s*SUBROUTINE\s+', content, re.MULTILINE)
        is_function = re.search(r'^\s*FUNCTION\s+', content, re.MULTILINE)

        if not is_subroutine and not is_function:
            self._add_issue(
                1, "S001", "File must define either SUBROUTINE or FUNCTION",
                severity=IssueSeverity.ERROR
            )
            return

        # NOTE: Three-phase structure (initialise -> process -> finalise) is TPH service layer specific,
        # not a universal requirement. AA Framework uses different structure (SET.ACTIVITY.DETAILS -> INITIALISE -> PROCESS).
        # This validator only checks that code is properly organized with GOSUB sections, not specific structure pattern.

        # Check for GOSUB sections (indicates organized code structure)
        has_gosub = bool(re.search(r'^\s*GOSUB\s+', content, re.MULTILINE))
        has_labeled_sections = bool(re.search(r'^[A-Z][A-Z0-9._]*:\s*$', content, re.MULTILINE))

        if is_subroutine and not has_gosub and not has_labeled_sections:
            if self.strict_mode:
                self._add_issue(
                    self._find_line_for_pattern(r'SUBROUTINE'),
                    "S002",
                    "SUBROUTINE should use GOSUB sections for code organization",
                    severity=IssueSeverity.INFO,
                    suggestion="Consider organizing code with labeled sections and GOSUB calls"
                )

        # Check for END statement (universal requirement)
        has_end = bool(re.search(r'^\s*END\s*$', content, re.MULTILINE))
        if not has_end:
            self._add_issue(
                len(self.lines),
                "S003",
                "Code must end with END statement",
                severity=IssueSeverity.ERROR
            )

    def _check_naming_conventions(self):
        """Check universal naming conventions (file names, record reads, error flags, constants)"""
        content = ''.join(self.lines)

        # NOTE: Parameter naming conventions (i<Name>, o<Name>, io<Name>) are TPH-specific,
        # not universal. They are validated in project-level validators (CLAUDE_TPH.md).
        # This validator only checks universal patterns.

        # Check universal naming patterns
        for line_num, line in enumerate(self.lines, 1):
            # Check for hard-coded positions in multi-value fields
            # (should use equates instead)
            assignments = re.finditer(r'\b([A-Z][A-Z0-9_]+)\s*=', line)
            for match in assignments:
                var_name = match.group(1)
                # Skip special variables
                if var_name in ['COMI', 'ETEXT', 'RETURN', 'IF', 'THEN', 'ELSE', 'END']:
                    continue
                # Check that universal patterns are followed
                # Universal patterns: FN.*, R.*, ERR.*, MY.*, EB.*, TP.*, UPPERCASE, camelCase
                if self.strict_mode:
                    # Allow: file equates (FN.*), record reads (R.*), error flags (ERR.*)
                    # Allow: DAS variables (MY.*), framework prefixes (EB.*, TP.*), UPPERCASE, camelCase
                    valid_patterns = var_name.startswith((
                        'FN.', 'R.', 'ERR.', 'MY.', 'EB', 'TP', 'AA', 'AC', 'ST', 'LD', 'FX'
                    )) or var_name.isupper() or self._is_camel_case(var_name)

                    if not valid_patterns:
                        self._add_issue(
                            line_num,
                            "N002",
                            f"Variable '{var_name}' should follow universal naming: FN.*, R.*, ERR.*, MY.*, UPPERCASE, or camelCase",
                            severity=IssueSeverity.INFO,
                            code_snippet=line.strip()
                        )

    def _is_camel_case(self, name: str) -> bool:
        """Check if name is camelCase (starts with lowercase)"""
        return name and name[0].islower()

    def _check_includes(self):
        """Check for universal include patterns ($INSERT and $USING directives)"""
        content = ''.join(self.lines)

        # Universal pattern: Use $INSERT for field definitions, common variables
        # Universal pattern: Use $USING for module/package imports
        has_insert = bool(re.search(r'^\s*\$INSERT\s+', content, re.MULTILINE))
        has_using = bool(re.search(r'^\s*\$USING\s+', content, re.MULTILINE))

        is_function = bool(re.search(r'^\s*FUNCTION\s+', content, re.MULTILINE))

        # FUNCTION should have $USING for framework imports (universal pattern)
        if is_function and not has_using and self.strict_mode:
            self._add_issue(
                self._find_line_for_pattern(r'FUNCTION'),
                "I001",
                "FUNCTION should include $USING directives for framework imports",
                severity=IssueSeverity.WARNING,
                suggestion="Add: $USING EB.API or project-specific service modules"
            )

        # Check for common missing $INSERT directives (optional recommendation)
        if not has_insert and self.strict_mode:
            self._add_issue(
                1,
                "I002",
                "Consider adding $INSERT directives for field definitions and common variables",
                severity=IssueSeverity.INFO,
                suggestion="Add: $INSERT I_F.* (field equates) and $INSERT I_EQUATE (constants)"
            )

        # Validate $USING patterns (should use UPPERCASE module names with dots)
        using_lines = re.finditer(r'^\s*\$USING\s+([A-Z0-9._]+)', content, re.MULTILINE)
        for match in using_lines:
            module = match.group(1)
            line_num = self._count_lines_before(match.start())
            if not re.match(r'^[A-Z][A-Z0-9.]*$', module):
                self._add_issue(
                    line_num,
                    "I003",
                    f"$USING module '{module}' should be UPPERCASE with dots (universal pattern)",
                    severity=IssueSeverity.WARNING
                )

    def _check_error_handling(self):
        """Check for universal error handling patterns (ETEXT checking after operations)"""
        content = ''.join(self.lines)

        # Check for ETEXT usage after operations (universal pattern)
        call_lines = re.finditer(
            r'^\s*(?:CALL|F\.|ST\.)([A-Z0-9._]+)\s*\(',
            content, re.MULTILINE
        )

        for match in call_lines:
            func_name = match.group(1)
            line_num = self._count_lines_before(match.start())

            # Look for error check in next few lines
            remaining = content[match.end():]
            lines_ahead = remaining.split('\n')[:5]
            remaining_text = '\n'.join(lines_ahead)

            # Check for common error patterns: ERR variable, ETEXT, error checking
            has_error_check = bool(re.search(
                r'(?:\bERR\b|\bETEXT\b|IF\s+\w+\s+THEN|getEtext|\.error|\.returnCode)',
                remaining_text
            ))

            if not has_error_check and self.strict_mode:
                if self.strict_mode:
                    self._add_issue(
                        line_num,
                        "E001",
                        f"Service call to '{func_name}' should check for errors afterwards",
                        severity=IssueSeverity.WARNING,
                        suggestion="Add: IF ERR THEN ... or IF ETEXT THEN ... or check error variable"
                    )

        # NOTE: serviceName field (E002) is TPH service layer specific (responseDetails.serviceName).
        # Not enforced here. See CLAUDE_TPH.md for TPH-specific structured response validation.

    def _check_anti_patterns(self):
        """Check for common anti-patterns"""
        content = ''.join(self.lines)

        # Anti-pattern 1: Hard-coded field positions (e.g., record<2>, record<3>)
        hardcoded = re.finditer(r'(\w+)\s*<\s*(\d+)\s*>', content)
        for match in hardcoded:
            var = match.group(1)
            pos = match.group(2)
            line_num = self._count_lines_before(match.start())

            # Ignore valid positions like array[1] for multi-value fields
            if int(pos) > 10:  # Likely a hard-coded position, not common index
                self._add_issue(
                    line_num,
                    "A001",
                    f"Hard-coded field position {pos} in '{var}<{pos}>'",
                    severity=IssueSeverity.ERROR,
                    code_snippet=self.lines[line_num - 1].strip(),
                    suggestion=f"Use field equates instead of position numbers"
                )

        # Anti-pattern 2: Missing error handling (checked in _check_error_handling)

        # Anti-pattern 3: Unreleased locks (F.READU locks records, F.READ does not)
        f_readu = re.finditer(r'F\.READU\s*\(\s*([^,]+),', content)
        for match in f_readu:
            file_var = match.group(1).strip()
            line_num = self._count_lines_before(match.start())

            # Check if there's a corresponding F.WRITE or F.RELEASE in remaining code
            remaining = content[match.end():]
            has_write = f'F.WRITE({file_var}' in remaining
            has_release = f'F.RELEASE({file_var}' in remaining

            if not (has_write or has_release):
                self._add_issue(
                    line_num,
                    "A003",
                    f"F.READU lock on '{file_var}' may not be released",
                    severity=IssueSeverity.WARNING,
                    suggestion=f"Ensure F.WRITE({file_var}, ...) or F.RELEASE({file_var}, id) is called before returning"
                )

        # Anti-pattern 4: Raw jBC instead of T24 APIs
        raw_file_ops = re.finditer(
            r"OPEN\s+'F\.|READ\s+\w+\s+FROM\s+F\.|WRITE\s+\w+\s+TO\s+F\.",
            content
        )
        for match in raw_file_ops:
            line_num = self._count_lines_before(match.start())
            self._add_issue(
                line_num,
                "A004",
                "Using raw jBC file I/O instead of T24 framework APIs",
                severity=IssueSeverity.ERROR,
                code_snippet=self.lines[line_num - 1].strip(),
                suggestion="Use framework services (EB.API, DAS layer) instead"
            )

        # Anti-pattern 5: Missing INSERT files (checked in _check_includes)

        # Anti-pattern 6: Deep nesting (check nesting depth)
        max_nesting = self._check_nesting_depth(content)
        if max_nesting > 3:
            self._add_issue(
                1,
                "A006",
                f"Code has nesting depth of {max_nesting} (should be max 3)",
                severity=IssueSeverity.INFO,
                suggestion="Consider using early returns to reduce nesting"
            )

    def _check_nesting_depth(self, content: str) -> int:
        """Calculate maximum nesting depth"""
        max_depth = 0
        current_depth = 0

        for char in content:
            if char in '{(':
                current_depth += 1
                max_depth = max(max_depth, current_depth)
            elif char in '}':
                current_depth = max(0, current_depth - 1)
            elif char == '\n':
                # For IF/END blocks, count separately
                pass

        return max_depth

    # ===== UTILITY METHODS =====

    def _find_line_for_pattern(self, pattern: str) -> int:
        """Find line number containing pattern"""
        for i, line in enumerate(self.lines, 1):
            if re.search(pattern, line):
                return i
        return 1

    def _count_lines_before(self, char_pos: int) -> int:
        """Count lines before character position"""
        content = ''.join(self.lines)
        return content[:char_pos].count('\n') + 1

    def _add_issue(self, line_num: int, rule_id: str, message: str,
                   severity: IssueSeverity = IssueSeverity.WARNING,
                   code_snippet: str = "", suggestion: str = ""):
        """Add validation issue"""
        snippet = code_snippet or (self.lines[line_num - 1].strip() if line_num <= len(self.lines) else "")
        self.issues.append(ValidationIssue(
            severity=severity,
            line_number=line_num,
            rule_id=rule_id,
            message=message,
            code_snippet=snippet,
            suggestion=suggestion
        ))


def validate_path(path_str: str, strict: bool = False) -> Tuple[int, int, int]:
    """
    Validate file or directory.
    Returns tuple of (files_checked, errors, warnings)
    """
    path = Path(path_str)

    if not path.exists():
        print(f"ERROR: Path not found: {path}")
        return 0, 1, 0

    files_to_check = []
    if path.is_file():
        if path.suffix.lower() == '.b':
            files_to_check = [path]
        else:
            print(f"ERROR: Not an InfoBasic file: {path}")
            return 0, 1, 0
    else:
        # Directory: find all .b files
        files_to_check = list(path.glob('**/*.b'))
        if not files_to_check:
            print(f"WARNING: No .b files found in {path}")
            return 0, 0, 1

    validator = InfoBasicValidator(strict_mode=strict)
    total_errors = 0
    total_warnings = 0
    total_infos = 0

    for file_path in sorted(files_to_check):
        try:
            issues = validator.validate_file(file_path)

            if issues:
                print(f"\n{'='*70}")
                print(f"FILE: {file_path}")
                print(f"{'='*70}")

                for issue in sorted(issues, key=lambda x: (x.line_number, x.severity.value)):
                    print(f"\n{issue}")
                    if issue.code_snippet:
                        print(f"  Code: {issue.code_snippet}")
                    if issue.suggestion:
                        print(f"  Suggestion: {issue.suggestion}")

                    if issue.severity == IssueSeverity.ERROR:
                        total_errors += 1
                    elif issue.severity == IssueSeverity.WARNING:
                        total_warnings += 1
                    else:
                        total_infos += 1
            else:
                print(f"✓ {file_path} - No issues found")

        except Exception as e:
            print(f"ERROR validating {file_path}: {e}")
            total_errors += 1

    return len(files_to_check), total_errors, total_warnings


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("InfoBasic Code Validator")
        print("\nValidates UNIVERSAL InfoBasic patterns from the InfoBasic Skill")
        print("(T24 File I/O, error handling, naming conventions, anti-patterns)")
        print("\nProject-specific validation:")
        print("  - TPH Service Layer: See CLAUDE_TPH.md for parameter naming, three-phase structure")
        print("  - AA Framework: See CLAUDE_AA.md for activity lifecycle, COMMON block patterns")
        print("\nUsage:")
        print("  python validate_infobasic.py <file.b>")
        print("  python validate_infobasic.py <directory>")
        print("  python validate_infobasic.py <file.b> --strict\n")
        print("Options:")
        print("  --strict   Enable stricter validation rules (INFO level checks)")
        return 1

    path = sys.argv[1]
    strict = '--strict' in sys.argv

    files_checked, errors, warnings = validate_path(path, strict=strict)

    # Summary
    print(f"\n{'='*70}")
    print(f"SUMMARY: {files_checked} file(s) checked")
    print(f"  Errors:   {errors}")
    print(f"  Warnings: {warnings}")
    print(f"{'='*70}")

    # Exit with error code if issues found
    return 1 if (errors > 0) else 0


if __name__ == '__main__':
    sys.exit(main())
