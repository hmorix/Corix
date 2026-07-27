import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Loader2, Heart, MessageCircle, Share2, Upload, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

// Sample stories data - in production, fetch from database
const SAMPLE_STORIES = [
  {
    id: 1,
    userId: 1,
    userName: "Sarah Chen",
    userAvatar: "SC",
    isVerified: true,
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop",
    caption: "Just finished an amazing photoshoot! 📸",
    likes: 234,
    comments: 12,
    views: 1203,
    isLiked: false,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    userId: 2,
    userName: "Alex Rodriguez",
    userAvatar: "AR",
    isVerified: false,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    caption: "New design project launched! 🎨",
    likes: 156,
    comments: 8,
    views: 892,
    isLiked: false,
    timestamp: "4 hours ago",
  },
];

export default function Stories() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [storyCaption, setStoryCaption] = useState("");
  const [storyImage, setStoryImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stories, setStories] = useState(SAMPLE_STORIES);
  const [likedStories, setLikedStories] = useState<number[]>([]);
  const [expandedComments, setExpandedComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setStoryImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStory = async () => {
    if (!storyImage || !storyCaption) return;

    setIsLoading(true);
    try {
      // TODO: Send to backend
      const newStory = {
        id: stories.length + 1,
        userId: user?.id || 1,
        userName: user?.name || "User",
        userAvatar: user?.name?.substring(0, 2).toUpperCase() || "U",
        isVerified: false,
        imageUrl: storyImage,
        caption: storyCaption,
        likes: 0,
        comments: 0,
        views: 0,
        isLiked: false,
        timestamp: "just now",
      };

      setStories([newStory, ...stories]);
      setStoryCaption("");
      setStoryImage(null);
      setShowCreateStory(false);
    } catch (error) {
      console.error("Failed to create story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = (storyId: number) => {
    if (likedStories.includes(storyId)) {
      setLikedStories(likedStories.filter((id) => id !== storyId));
    } else {
      setLikedStories([...likedStories, storyId]);
    }

    setStories(
      stories.map((story) =>
        story.id === storyId
          ? {
              ...story,
              likes: likedStories.includes(storyId) ? story.likes - 1 : story.likes + 1,
              isLiked: !story.isLiked,
            }
          : story
      )
    );
  };

  return (
    <div className="min-h-screen gradient-transcendent">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <a href="/home" className="serif-heading text-xl">
            Corix
          </a>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/home")}>
              Home
            </Button>
            <Button
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => setShowCreateStory(true)}
            >
              New Story
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="serif-heading text-lg mb-4">Stories</h3>
              <p className="text-sm text-muted-foreground">
                Share your latest work, projects, and creative moments with your community.
              </p>
            </Card>
          </div>

          {/* Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Story Card */}
            {!showCreateStory && (
              <Card className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-lg font-bold text-accent">
                    {user?.name?.substring(0, 1).toUpperCase()}
                  </div>
                  <button
                    onClick={() => setShowCreateStory(true)}
                    className="flex-1 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-all text-left"
                  >
                    Share your story...
                  </button>
                </div>
              </Card>
            )}

            {/* Create Story Modal */}
            {showCreateStory && (
              <Card className="p-6 border-2 border-accent">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="serif-heading text-lg">Create Story</h3>
                  <button
                    onClick={() => {
                      setShowCreateStory(false);
                      setStoryImage(null);
                      setStoryCaption("");
                    }}
                    className="p-1 hover:bg-muted rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Image Upload */}
                  {!storyImage ? (
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 transition-all">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload image</p>
                      </div>
                    </label>
                  ) : (
                    <div>
                      <img
                        src={storyImage}
                        alt="Story preview"
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                      <Button
                        variant="outline"
                        className="w-full border-2 border-border mb-4"
                        onClick={() => setStoryImage(null)}
                      >
                        Change Image
                      </Button>
                    </div>
                  )}

                  {/* Caption */}
                  <Textarea
                    placeholder="Write a caption for your story..."
                    value={storyCaption}
                    onChange={(e) => setStoryCaption(e.target.value)}
                    rows={3}
                    className="text-foreground"
                  />

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1 border-2 border-border"
                      onClick={() => {
                        setShowCreateStory(false);
                        setStoryImage(null);
                        setStoryCaption("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={handleCreateStory}
                      disabled={!storyImage || !storyCaption || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        "Post Story"
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Stories Feed */}
            {stories.map((story) => (
              <Card key={story.id} className="overflow-hidden">
                {/* Story Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent">
                      {story.userAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{story.userName}</p>
                        {story.isVerified && (
                          <span className="text-accent text-sm">✓</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{story.timestamp}</p>
                    </div>
                  </div>
                </div>

                {/* Story Image */}
                <img
                  src={story.imageUrl}
                  alt={story.caption}
                  className="w-full h-96 object-cover"
                />

                {/* Story Caption */}
                <div className="p-4 border-b border-border">
                  <p className="text-foreground">{story.caption}</p>
                </div>

                {/* Story Stats */}
                <div className="px-4 py-2 border-b border-border flex gap-6 text-sm text-muted-foreground">
                  <span>{story.likes} likes</span>
                  <span>{story.comments} comments</span>
                  <span>{story.views} views</span>
                </div>

                {/* Story Actions */}
                <div className="p-4 flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => toggleLike(story.id)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        likedStories.includes(story.id)
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    Like
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() =>
                      setExpandedComments(
                        expandedComments === story.id ? null : story.id
                      )
                    }
                  >
                    <MessageCircle className="w-5 h-5" />
                    Comment
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 gap-2">
                    <Share2 className="w-5 h-5" />
                    Share
                  </Button>
                </div>

                {/* Comments Section */}
                {expandedComments === story.id && (
                  <div className="p-4 border-t border-border space-y-4">
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
                          U
                        </div>
                        <div className="flex-1 bg-muted rounded-lg p-2">
                          <p className="text-xs font-medium text-foreground">User</p>
                          <p className="text-sm text-foreground">Great work! 🎉</p>
                        </div>
                      </div>
                    </div>

                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        disabled={!commentText}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
