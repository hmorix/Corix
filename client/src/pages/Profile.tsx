import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Loader2, Edit2, Heart, Eye, Share2, Mail, Youtube, Instagram, Twitter } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const profileQuery = trpc.profile.me.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const portfolioQuery = trpc.portfolio.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (profileQuery.isLoading || portfolioQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const profile = profileQuery.data;
  const portfolios = portfolioQuery.data || [];

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
              onClick={() => navigate("/portfolio/create")}
            >
              New Portfolio
            </Button>
          </div>
        </div>
      </nav>

      {/* Profile Header */}
      <div className="gradient-lavender py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-accent/10 border-4 border-accent flex items-center justify-center">
              {profile?.avatarUrl && (
                <img
                  src={profile.avatarUrl}
                  alt={user?.name || "Profile"}
                  className="w-full h-full rounded-full object-cover"
                />
              )}
              {!profile?.avatarUrl && (
                <div className="text-4xl font-bold text-accent">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
              <h1 className="serif-heading text-4xl">{user?.name}</h1>
              {profile?.isVerified && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  ✓ Verified
                </span>
              )}
            </div>
              <p className="text-lg text-muted-foreground mb-4">
                {profile?.profession || "Creative Professional"}
              </p>

              {profile?.bio && <p className="text-foreground mb-6">{profile.bio}</p>}

              {/* Stats */}
              <div className="flex gap-8 mb-6">
                <div>
                  <p className="text-2xl font-bold text-accent">{profile?.followersCount || 0}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{profile?.subscribersCount || 0}</p>
                  <p className="text-sm text-muted-foreground">Subscribers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{portfolios.length}</p>
                  <p className="text-sm text-muted-foreground">Works</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{profile?.viewsCount || 0}</p>
                  <p className="text-sm text-muted-foreground">Views</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => navigate("/profile/edit")}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="border-2 border-border">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Skills */}
            {profile?.skills && profile.skills.length > 0 && (
              <Card className="p-6">
                <h3 className="serif-heading text-lg mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Hiring Info */}
            {profile?.isAvailableForHire && (
              <Card className="p-6 border-2 border-accent">
                <h3 className="serif-heading text-lg mb-4">Available for Hire</h3>
                {profile.hourlyRate && (
                  <p className="text-2xl font-bold text-accent mb-4">
                    ${profile.hourlyRate}/hour
                  </p>
                )}
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact for Work
                </Button>
              </Card>
            )}

            {/* Social Links */}
            {(profile?.youtubeUrl ||
              profile?.instagramUrl ||
              profile?.twitterUrl ||
              profile?.portfolioUrl) && (
              <Card className="p-6">
                <h3 className="serif-heading text-lg mb-4">Connect</h3>
                <div className="space-y-2">
                  {profile.youtubeUrl && (
                    <a
                      href={profile.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:underline"
                    >
                      <Youtube className="w-4 h-4" />
                      YouTube
                    </a>
                  )}
                  {profile.instagramUrl && (
                    <a
                      href={profile.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:underline"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
                  {profile.twitterUrl && (
                    <a
                      href={profile.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:underline"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </a>
                  )}
                  {profile.portfolioUrl && (
                    <a
                      href={profile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:underline"
                    >
                      <Share2 className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Right Content */}
          <div className="md:col-span-2">
            <h2 className="serif-heading text-2xl mb-6">Portfolio Works</h2>

            {portfolios.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-6">
                  You haven't created any portfolio pieces yet
                </p>
                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => navigate("/portfolio/create")}
                >
                  Create Your First Portfolio
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {portfolios.map((work: any) => (
                  <Card key={work.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {work.imageUrl && (
                      <img
                        src={work.imageUrl}
                        alt={work.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="serif-heading text-lg mb-2">{work.title}</h3>
                      {work.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {work.description}
                        </p>
                      )}
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {work.likes || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {work.views || 0}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
