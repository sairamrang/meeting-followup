/**
 * Spec Viewer Template
 *
 * Extracted from Anthropic's web-artifacts-builder skill.
 * Used by temn-spec-render to generate spec.html
 *
 * Source: https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder
 *
 * Usage: Replace placeholders with actual spec data:
 * - {{FEATURE_NAME}} - Feature name from spec.yaml
 * - {{VERSION}} - Version from spec.yaml
 * - {{STATUS}} - Status from spec.yaml
 * - {{SCORE}} - Quality score from spec.yaml
 * - {{FUNCTIONAL_CONTENT}} - Rendered spec-functional.md
 * - {{TECHNICAL_CONTENT}} - Rendered spec-technical.md
 * - {{DIAGRAMS}} - Mermaid diagrams from _artifacts/diagrams/
 * - {{IMAGES}} - Images from _artifacts/images/
 * - {{FIGMA_EMBEDS}} - Figma iframes if URLs found
 */

import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import mermaid from 'mermaid'

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  securityLevel: 'loose',
})

interface SpecData {
  featureName: string
  version: string
  status: string
  score: number
  functionalContent: string
  technicalContent: string
  diagrams: Array<{ name: string; code: string }>
  images: Array<{ name: string; src: string; caption?: string }>
  figmaUrls: string[]
}

export default function SpecViewer({ data }: { data: SpecData }) {
  useEffect(() => {
    // Re-render mermaid diagrams after component mounts
    mermaid.contentLoaded()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto py-4 px-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">{data.featureName}</h1>
            <div className="flex gap-2">
              <Badge variant="outline">v{data.version}</Badge>
              <Badge variant={data.status === 'Ready for Planning' ? 'default' : 'secondary'}>
                {data.status}
              </Badge>
              <Badge variant="secondary">Score: {data.score}/10</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4 max-w-4xl">
        <Tabs defaultValue="functional" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="functional">Functional</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
            <TabsTrigger value="designs">Designs</TabsTrigger>
          </TabsList>

          {/* Functional Spec */}
          <TabsContent value="functional">
            <Card>
              <CardHeader>
                <CardTitle>Functional Specification</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[70vh]">
                  <div
                    className="prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.functionalContent }}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Spec */}
          <TabsContent value="technical">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specification</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[70vh]">
                  <div
                    className="prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.technicalContent }}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diagrams */}
          <TabsContent value="diagrams">
            <div className="space-y-6">
              {data.diagrams.length > 0 ? (
                data.diagrams.map((diagram, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{diagram.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-4 rounded-lg overflow-auto">
                        <div className="mermaid">{diagram.code}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No diagrams available. Use <code>/temn:temn-diagram</code> to add diagrams.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Designs */}
          <TabsContent value="designs">
            <div className="space-y-6">
              {/* Images */}
              {data.images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Screenshots & Mockups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {data.images.map((image, index) => (
                        <figure key={index} className="space-y-2">
                          <img
                            src={image.src}
                            alt={image.name}
                            className="rounded-lg border max-w-full"
                          />
                          {image.caption && (
                            <figcaption className="text-sm text-muted-foreground text-center">
                              {image.caption}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Figma Embeds */}
              {data.figmaUrls.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Figma Designs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.figmaUrls.map((url, index) => (
                        <iframe
                          key={index}
                          src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`}
                          className="w-full h-[450px] border rounded-lg"
                          allowFullScreen
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Empty State */}
              {data.images.length === 0 && data.figmaUrls.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No designs available. Add images to <code>_artifacts/images/</code> or include Figma URLs in spec.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-8 print:hidden">
        <div className="container mx-auto py-4 px-4 max-w-4xl text-center text-sm text-muted-foreground">
          Generated by <code>/temn:temn-spec-render</code>
        </div>
      </footer>
    </div>
  )
}
