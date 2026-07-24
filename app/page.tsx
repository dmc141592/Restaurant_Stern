import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Temporary placeholder to verify the design system (fonts, tokens, shadcn/ui
// primitives) renders correctly. Replaced with the real public pages in the
// next migration phase.
export default function Home() {
  return (
    <div className="container-page flex min-h-screen flex-col items-start justify-center gap-6 py-24">
      <Badge>Phase 2 – Design System</Badge>
      <h1 className="font-serif text-5xl text-primary">Sternen Albisrieden</h1>
      <p className="max-w-xl text-muted-foreground">
        Design tokens, next/font (Cormorant Garamond & Inter) and shadcn/ui primitives are wired up.
        This placeholder page will be replaced by the real public site.
      </p>
      <Card className="w-full max-w-sm border-border">
        <CardContent className="flex flex-col gap-3 p-6">
          <p className="text-sm text-muted-foreground">Beispielkarte</p>
          <Button>Tisch reservieren</Button>
          <Button variant="outline">Speisekarte entdecken</Button>
        </CardContent>
      </Card>
    </div>
  );
}
