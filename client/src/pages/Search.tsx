import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Users, MapPin, Star } from "lucide-react";

// Sample creators data - in production, fetch from database
const SAMPLE_CREATORS = [
  {
    id: 1,
    name: "Sarah Chen",
    profession: "Video Creator",
    bio: "Creating cinematic content for brands",
    followers: 2500,
    skills: ["Videography", "Editing", "Motion Design"],
    avatar: "SC",
    available: true,
    rate: 150,
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    profession: "Graphic Designer",
    bio: "Specializing in brand identity and UI design",
    followers: 1800,
    skills: ["UI Design", "Branding", "Illustration"],
    avatar: "AR",
    available: true,
    rate: 120,
  },
  {
    id: 3,
    name: "Jordan Kim",
    profession: "Web Developer",
    bio: "Full-stack developer with 5+ years experience",
    followers: 3200,
    skills: ["React", "Node.js", "Web Design"],
    avatar: "JK",
    available: false,
    rate: 180,
  },
  {
    id: 4,
    name: "Emma Thompson",
    profession: "Photographer",
    bio: "Portrait and lifestyle photography",
    followers: 1500,
    skills: ["Photography", "Retouching", "Lighting"],
    avatar: "ET",
    available: true,
    rate: 100,
  },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [availableOnly, setAvailableOnly] = useState(false);

  const categories = [
    "Video Creator",
    "Graphic Designer",
    "Web Developer",
    "Photographer",
    "Content Creator",
    "Illustrator",
  ];

  const filteredCreators = SAMPLE_CREATORS.filter((creator) => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.profession.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || creator.profession === selectedCategory;
    const matchesPrice = creator.rate >= priceRange[0] && creator.rate <= priceRange[1];
    const matchesAvailability = !availableOnly || creator.available;

    return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
  });

  return (
    <div className="min-h-screen gradient-transcendent">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <a href="/home" className="serif-heading text-xl">
            Corix
          </a>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Home
            </Button>
            <Button variant="ghost" size="sm">
              Messages
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="gradient-lavender py-12">
        <div className="container">
          <h1 className="serif-heading text-4xl mb-4">Find Creators & Professionals</h1>
          <p className="text-lg text-muted-foreground">
            Discover talented creators and professionals for your next project
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="serif-heading text-lg mb-6">Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Search
                </label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Name or profession..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground block mb-3">
                  Category
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      selectedCategory === null
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                        selectedCategory === cat
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground block mb-3">
                  Hourly Rate: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              {/* Availability */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-foreground">
                    Available for hire
                  </span>
                </label>
              </div>

              <Button
                variant="outline"
                className="w-full border-2 border-border"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                  setPriceRange([0, 500]);
                  setAvailableOnly(false);
                }}
              >
                Reset Filters
              </Button>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Found <span className="font-bold text-foreground">{filteredCreators.length}</span>{" "}
                results
              </p>
            </div>

            {filteredCreators.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-6">
                  No creators found matching your filters
                </p>
                <Button
                  variant="outline"
                  className="border-2 border-border"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setPriceRange([0, 500]);
                    setAvailableOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCreators.map((creator) => (
                  <Card key={creator.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-xl font-bold text-accent">
                        {creator.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="serif-heading text-lg">{creator.name}</h3>
                        <p className="text-sm text-accent font-medium">{creator.profession}</p>
                        {creator.available && (
                          <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Available
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{creator.bio}</p>

                    {/* Stats */}
                    <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {creator.followers} followers
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        ${creator.rate}/hr
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {creator.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      View Profile
                    </Button>
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
