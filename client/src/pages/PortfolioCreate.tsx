import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Loader2, Upload, Grid3x3, ChevronRight, Search, Wand2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ChromaKeyRemover from "@/components/ChromaKeyRemover";

// Sample templates
const SAMPLE_TEMPLATES = [
  { id: "minimal-1", name: "Minimal Clean", category: "minimal", preview: "bg-gradient-lavender" },
  { id: "modern-1", name: "Modern Bold", category: "modern", preview: "bg-gradient-blush" },
  { id: "creative-1", name: "Creative Flow", category: "creative", preview: "bg-gradient-mint" },
  { id: "minimal-2", name: "Elegant", category: "minimal", preview: "bg-gradient-lavender" },
  { id: "modern-2", name: "Contemporary", category: "modern", preview: "bg-gradient-blush" },
  { id: "creative-2", name: "Artistic", category: "creative", preview: "bg-gradient-mint" },
];

type Step = "templates" | "upload" | "background" | "details" | "review";

export default function PortfolioCreate() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBackgroundRemoval, setShowBackgroundRemoval] = useState(false);

  const createPortfolioMutation = trpc.portfolio.create.useMutation();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const filteredTemplates = SAMPLE_TEMPLATES.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setStep("background");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundRemovalComplete = (processedUrl: string) => {
    setProcessedImage(processedUrl);
  };

  const handleCreatePortfolio = async () => {
    if (!title || !uploadedImage || !selectedTemplate) {
      return;
    }

    setIsLoading(true);
    try {
      // Use processed image if available, otherwise use original
      const finalImage = processedImage || uploadedImage;
      
      await createPortfolioMutation.mutateAsync({
        title,
        description,
        imageUrl: finalImage,
        templateId: selectedTemplate,
        category: "portfolio",
      });
      navigate("/profile");
    } catch (error) {
      console.error("Failed to create portfolio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-transcendent py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="serif-heading text-4xl mb-2">Create Your Portfolio</h1>
          <p className="sans-secondary text-muted-foreground">
            Choose a template, upload your photo, remove background, and showcase your work
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-2 mb-12 overflow-x-auto pb-2">
          {(["templates", "upload", "background", "details", "review"] as Step[]).map((s, idx) => (
            <div key={s} className="flex items-center gap-2 whitespace-nowrap">
              <button
                onClick={() => setStep(s)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  step === s
                    ? "bg-accent text-accent-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {idx + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
              {idx < 4 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {/* Step 1: Template Selection */}
        {step === "templates" && (
          <div>
            {/* Search and Filter */}
            <div className="mb-8 flex gap-4 flex-col sm:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={categoryFilter || ""}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-foreground"
              >
                <option value="">All Categories</option>
                <option value="minimal">Minimal</option>
                <option value="modern">Modern</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            {/* Template Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setStep("upload");
                  }}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate === template.id ? "ring-2 ring-accent" : ""
                  }`}
                >
                  <div className={`${template.preview} w-full h-40 rounded-lg mb-4`}></div>
                  <h3 className="serif-heading text-lg mb-1">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4 capitalize">{template.category}</p>
                  <Button
                    size="sm"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Select
                  </Button>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <Grid3x3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No templates found</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Photo Upload */}
        {step === "upload" && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-12 border-2 border-dashed border-border">
              {!uploadedImage ? (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="serif-heading text-xl mb-2">Upload Your Photo</h3>
                  <p className="sans-secondary text-muted-foreground mb-6">
                    Choose a high-quality photo to showcase in your portfolio
                  </p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                    >
                      Choose Photo
                    </Button>
                  </label>
                </div>
              ) : (
                <div>
                  <img
                    src={uploadedImage}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1 border-2 border-border"
                      onClick={() => setUploadedImage(null)}
                    >
                      Change Photo
                    </Button>
                    <Button
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={() => setStep("background")}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Step 3: Background Removal */}
        {step === "background" && uploadedImage && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex gap-4">
              <Button
                variant={showBackgroundRemoval ? "default" : "outline"}
                className={showBackgroundRemoval ? "bg-accent text-accent-foreground" : "border-2 border-border"}
                onClick={() => setShowBackgroundRemoval(true)}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Remove Background
              </Button>
              <Button
                variant={!showBackgroundRemoval ? "default" : "outline"}
                className={!showBackgroundRemoval ? "bg-accent text-accent-foreground" : "border-2 border-border"}
                onClick={() => setShowBackgroundRemoval(false)}
              >
                Skip
              </Button>
            </div>

            {showBackgroundRemoval ? (
              <ChromaKeyRemover
                imageUrl={uploadedImage}
                onImageProcessed={handleBackgroundRemovalComplete}
              />
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-6">
                  You can skip background removal and continue with your original photo
                </p>
              </Card>
            )}

            <div className="mt-6 flex gap-4">
              <Button
                variant="outline"
                className="flex-1 border-2 border-border"
                onClick={() => setStep("upload")}
              >
                Back
              </Button>
              <Button
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => setStep("details")}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Details */}
        {step === "details" && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-foreground font-medium mb-2 block">
                    Portfolio Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., My Creative Portfolio"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-foreground font-medium mb-2 block">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about this portfolio piece..."
                    value={description || ""}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="text-foreground"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-border"
                    onClick={() => setStep("background")}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => setStep("review")}
                    disabled={!title}
                  >
                    Review
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 5: Review */}
        {step === "review" && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <h2 className="serif-heading text-2xl mb-6">Review Your Portfolio</h2>

              <div className="space-y-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                    Template
                  </p>
                  <p className="text-foreground font-medium">
                    {SAMPLE_TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                    Photo
                  </p>
                  <img
                    src={(processedImage || uploadedImage) || ""}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {processedImage && (
                    <p className="text-xs text-accent mt-2">Background removed</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                    Title
                  </p>
                  <p className="text-foreground font-medium">{title}</p>
                </div>

                {description && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                      Description
                    </p>
                    <p className="text-foreground">{description}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-border"
                    onClick={() => setStep("details")}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={handleCreatePortfolio}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      "Publish Portfolio"
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
