"use client";

import { useState } from "react";
import { Loader2, ImageIcon, SendHorizontal, Github } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a prompt",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setImage(data.imageUrl);
      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate image",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-8 w-8" />
            <h1 className="text-2xl font-bold">AI Image Generator</h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/yourusername/ai-image-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Github className="h-6 w-6" />
            </a>
            <ThemeToggle />
          </div>
        </nav>

        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Create Image</h2>
            <p className="text-sm text-muted-foreground">
              Enter a detailed description of the image you want to generate.
            </p>
          </div>

          <div className="space-y-4">
            <Textarea
              placeholder="A serene landscape with mountains reflected in a crystal-clear lake at sunset..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />

            <Button
              onClick={generateImage}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <SendHorizontal className="mr-2 h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
          </div>
        </Card>

        {image && (
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Generated Image</h2>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <img
                src={image}
                alt="Generated image"
                className="object-cover"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => window.open(image, '_blank')}
              className="w-full"
            >
              Open Full Size
            </Button>
          </Card>
        )}

        <footer className="text-center text-sm text-muted-foreground">
          <p>Built with Next.js, Tailwind CSS, and shadcn/ui</p>
        </footer>
      </div>
    </main>
  );
}