import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clapperboard,
  Clock3,
  Globe2,
  RefreshCw,
  Sparkles,
  Star,
  Ticket,
  User,
  Play,
  Heart,
  Share2,
  BookmarkPlus,
  Film,
  Award,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  ChevronDown,
} from "lucide-react";

import { useMovieDetails } from "@/hooks/useMovies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TMDB_IMG = "https://image.tmdb.org/t/p";

const GENRE_COLORS: Record<string, string> = {
  Action: "from-red-500 to-orange-500",
  Adventure: "from-amber-400 to-yellow-500",
  Animation: "from-pink-500 to-purple-500",
  Comedy: "from-yellow-400 to-amber-500",
  Crime: "from-slate-600 to-gray-700",
  Documentary: "from-emerald-500 to-green-600",
  Drama: "from-blue-600 to-indigo-700",
  Fantasy: "from-fuchsia-500 to-purple-600",
  Horror: "from-rose-900 to-red-950",
  Mystery: "from-indigo-600 to-purple-700",
  Romance: "from-rose-400 to-pink-500",
  Thriller: "from-zinc-700 to-slate-800",
  "Science Fiction": "from-cyan-500 to-blue-600",
};

const formatRuntime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const formatReleaseDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: movie, isLoading, isError, refetch } = useMovieDetails(id!);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "related">("overview");

  const primaryGradient = useMemo(() => {
    if (!movie?.genres?.length) return "from-orange-500/40";
    const firstGenre = movie.genres[0].name;
    return GENRE_COLORS[firstGenre] ?? "from-orange-500/40";
  }, [movie]);

  if (isLoading) return <MovieDetailsSkeleton />;
  if (isError || !movie) return <ErrorState refetch={refetch} />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background transition-colors duration-500">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className={`absolute inset-0 bg-gradient-to-br ${primaryGradient} via-transparent to-transparent opacity-30 dark:opacity-20`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[85vh] min-h-[700px] overflow-hidden">
        {/* Backdrop Image with Zoom Effect */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={`${TMDB_IMG}/original${movie.backdropPath}`}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.1),transparent_50%)]" />

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-6 md:p-8 lg:p-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              className="h-11 rounded-full border-border/50 bg-background/30 backdrop-blur-xl hover:bg-background/50 transition-all duration-300"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2"
          >
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-full border-border/50 bg-background/30 backdrop-blur-xl hover:bg-background/50"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-5 w-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-full border-border/50 bg-background/30 backdrop-blur-xl hover:bg-background/50"
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <BookmarkPlus className={`h-5 w-5 transition-colors ${isBookmarked ? "fill-primary text-primary" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-full border-border/50 bg-background/30 backdrop-blur-xl hover:bg-background/50"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        {/* Main Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-8 md:px-12 md:pb-12 lg:px-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-5"
            >
              {/* Genre Badges */}
              <div className="flex flex-wrap gap-2">
                {movie.genres.slice(0, 3).map((genre, index) => (
                  <motion.div
                    key={genre.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Badge
                      variant="secondary"
                      className={`rounded-full border-0 bg-gradient-to-r ${GENRE_COLORS[genre.name] || "from-primary/80 to-primary"} px-4 py-1.5 text-xs font-semibold text-white shadow-lg`}
                    >
                      {genre.name}
                    </Badge>
                  </motion.div>
                ))}
              </div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl xl:text-8xl"
              >
                {movie.title}
              </motion.h1>

              {/* Tagline / Quick Info */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 text-sm text-muted-foreground md:text-base"
              >
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatReleaseDate(movie.releaseDate)}
                </span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span className="flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4" />
                  {formatRuntime(movie.runtime)}
                </span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span className="flex items-center gap-1.5">
                  <Globe2 className="h-4 w-4" />
                  {movie.language.toUpperCase()}
                </span>
              </motion.p>

              {/* Overview Preview */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="max-w-2xl text-base text-muted-foreground line-clamp-3 md:text-lg"
              >
                {movie.overview}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                <Button
                  size="lg"
                  className="h-12 rounded-full px-8 text-base font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                >
                  <Ticket className="mr-2 h-5 w-5" />
                  Book Tickets
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-border/50 px-8 text-base font-semibold backdrop-blur-sm hover:bg-muted/50"
                  onClick={() => setShowTrailer(true)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Trailer
                </Button>
              </motion.div>
            </motion.div>

            {/* Rating Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="relative"
            >
              <div className="relative rounded-3xl border border-border/50 bg-card/80 p-6 backdrop-blur-2xl shadow-2xl">
                <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-primary/30 to-transparent blur-lg opacity-50" />
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-muted stroke-current opacity-20"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${movie.voteAverage * 10}, 100`}
                        className="text-primary stroke-current"
                      />
                    </svg>
                    <Star className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 fill-primary text-primary" />
                  </div>
                  <div>
                    <p className="text-4xl font-black leading-none">{movie.voteAverage.toFixed(1)}</p>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">TMDB Score</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="relative z-10 -mt-32 px-6 pb-20 md:px-12 lg:px-20">
        <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
          {/* Poster Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="sticky top-8 space-y-6">
              <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 p-3 shadow-2xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <img
                  src={`${TMDB_IMG}/w780${movie.posterPath}`}
                  alt={movie.title}
                  className="aspect-[2/3] w-full rounded-2xl object-cover shadow-lg"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Popularity</p>
                      <p className="font-semibold">#1 This Week</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                      <Award className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Awards</p>
                      <p className="font-semibold">3 Wins, 5 Nominations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Tabs & Details */}
          <div className="space-y-8">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex gap-2 rounded-2xl border border-border/50 bg-card/50 p-1.5 backdrop-blur-sm w-fit"
            >
              {[
                { id: "overview", label: "Overview", icon: Film },
                { id: "reviews", label: "Reviews", icon: MessageSquare },
                { id: "related", label: "Related", icon: Film },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Story Section */}
                  <div className="rounded-3xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
                        <Film className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">Storyline</h2>
                    </div>
                    <p className="text-lg leading-relaxed text-muted-foreground">{movie.overview}</p>
                  </div>

                  {/* Info Grid */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        icon: Clock3,
                        label: "Runtime",
                        value: formatRuntime(movie.runtime),
                        gradient: "from-blue-500/20 to-cyan-500/20",
                      },
                      {
                        icon: Calendar,
                        label: "Release Date",
                        value: formatReleaseDate(movie.releaseDate),
                        gradient: "from-purple-500/20 to-pink-500/20",
                      },
                      {
                        icon: Globe2,
                        label: "Original Language",
                        value: movie.language.toUpperCase(),
                        gradient: "from-green-500/20 to-emerald-500/20",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/30"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
                        <div className="relative">
                          <item.icon className="mb-3 h-6 w-6 text-primary" />
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                          <p className="mt-1 text-xl font-bold">{item.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Cast Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/5">
                          <User className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">Cast & Crew</h2>
                          <p className="text-sm text-muted-foreground">Meet the talented ensemble</p>
                        </div>
                      </div>
                    </div>

                    <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                      <CarouselContent className="-ml-4">
                        {movie.cast.slice(0, 10).map((person, index) => (
                          <CarouselItem key={`${person.name}-${index}`} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                            <motion.article
                              initial={{ opacity: 0, scale: 0.95 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ y: -8 }}
                              className="group cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
                            >
                              <div className="relative aspect-[3/4] overflow-hidden">
                                {person.profile_path ? (
                                  <>
                                    <img
                                      src={`${TMDB_IMG}/w500${person.profile_path}`}
                                      alt={person.name}
                                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                                  </>
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <User className="h-12 w-12 text-muted-foreground/40" />
                                  </div>
                                )}
                              </div>
                              <div className="p-4">
                                <p className="truncate text-base font-semibold">{person.name}</p>
                                <p className="mt-1 truncate text-xs text-muted-foreground">{person.character}</p>
                              </div>
                            </motion.article>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="-left-4 hidden border-border/50 bg-card/80 md:flex" />
                      <CarouselNext className="-right-4 hidden border-border/50 bg-card/80 md:flex" />
                    </Carousel>
                  </div>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="rounded-3xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/5">
                        <ThumbsUp className="h-5 w-5 text-green-500" />
                      </div>
                      <h2 className="text-2xl font-bold">Audience Reviews</h2>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-2xl border border-border/50 bg-background/50 p-5">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold">Movie Fan {i}</p>
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, j) => (
                                    <Star key={j} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">2 days ago</span>
                          </div>
                          <p className="text-muted-foreground">
                            Absolutely stunning visuals and incredible performances! This movie exceeded all my expectations. A must-watch for any cinema lover.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "related" && (
                <motion.div
                  key="related"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-3xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/5">
                      <Film className="h-5 w-5 text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-bold">More Like This</h2>
                  </div>
                  <p className="text-muted-foreground">Discover similar movies based on genre and themes.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="px-6 py-12 md:px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center text-center"
          >
            <Sparkles className="mb-4 h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold md:text-3xl">Ready to Experience It?</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Get your tickets now and immerse yourself in this cinematic masterpiece.
            </p>
            <Button
              size="lg"
              className="mt-6 h-12 rounded-full px-10 text-base font-semibold shadow-xl shadow-primary/25"
            >
              <Ticket className="mr-2 h-5 w-5" />
              Book Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={() => setShowTrailer(false)}
              >
                <ChevronDown className="h-6 w-6" />
              </Button>
              <div className="flex h-full items-center justify-center">
                <Play className="h-16 w-16 text-white/50" />
                <p className="mt-4 text-white/70">Trailer placeholder - Integrate YouTube/Vimeo here</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MovieDetailsSkeleton = () => (
  <div className="min-h-screen space-y-8 bg-background p-6 md:p-12">
    <Skeleton className="h-[60vh] w-full rounded-3xl" />
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <Skeleton className="aspect-[2/3] w-full rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  </div>
);

const ErrorState = ({ refetch }: { refetch: () => void }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="mb-6 rounded-full border border-destructive/40 bg-destructive/10 p-5"
    >
      <Clapperboard className="h-12 w-12 text-destructive" />
    </motion.div>
    <h2 className="text-3xl font-black tracking-tight">Couldn&apos;t load movie details</h2>
    <p className="mt-3 max-w-md text-muted-foreground">
      Something interrupted the data stream. Please try again.
    </p>
    <Button onClick={() => refetch()} className="mt-7 rounded-2xl">
      <RefreshCw className="mr-2 h-4 w-4" />
      Retry
    </Button>
  </div>
);

export default MovieDetailsPage;
