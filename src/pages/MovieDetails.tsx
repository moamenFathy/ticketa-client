import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
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

const GENRE_ACCENTS: Record<string, string> = {
  Action: "from-red-500/30",
  Adventure: "from-amber-400/30",
  Animation: "from-pink-500/30",
  Comedy: "from-yellow-400/30",
  Crime: "from-slate-500/30",
  Documentary: "from-emerald-500/30",
  Drama: "from-blue-500/30",
  Fantasy: "from-fuchsia-500/30",
  Horror: "from-rose-950/40",
  Mystery: "from-indigo-500/30",
  Romance: "from-rose-500/30",
  Thriller: "from-zinc-700/30",
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

  const accent = useMemo(() => {
    if (!movie?.genres?.length) return "from-primary/30";
    return GENRE_ACCENTS[movie.genres[0].name] ?? "from-primary/30";
  }, [movie]);

  if (isLoading) return <MovieDetailsSkeleton />;
  if (isError || !movie) return <ErrorState refetch={refetch} />;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090b11] text-white">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${accent} via-transparent to-transparent`} />

      <section className="relative h-[88vh] min-h-[680px] w-full overflow-hidden">
        <img
          src={`${TMDB_IMG}/original${movie.backdropPath}`}
          alt={movie.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b11] via-[#090b11]/25 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.18),transparent_42%)]" />

        <div className="absolute left-6 top-6 z-30 md:left-12 md:top-10">
          <Button
            variant="secondary"
            className="h-12 rounded-full border border-white/20 bg-black/50 px-5 text-white backdrop-blur-md hover:bg-black/70"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="absolute bottom-0 z-20 w-full px-6 pb-10 md:px-12 md:pb-14 lg:px-20">
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div className="space-y-5">
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                <Badge className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-[11px] uppercase tracking-[0.24em] backdrop-blur">
                  <Sparkles className="mr-2 h-3.5 w-3.5" />
                  Cinematic Spotlight
                </Badge>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="max-w-4xl text-4xl font-black leading-[0.95] tracking-tight md:text-6xl lg:text-8xl"
              >
                {movie.title}
              </motion.h1>
              <p className="max-w-3xl text-sm text-white/75 md:text-base">{movie.overview}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-fit rounded-3xl border border-white/20 bg-black/45 p-6 backdrop-blur-2xl"
            >
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                <div>
                  <p className="text-4xl font-black leading-none">{movie.voteAverage.toFixed(1)}</p>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/60">Audience score</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-28 px-6 pb-24 md:px-12 lg:px-20">
        <div className="grid gap-10 lg:grid-cols-[360px_1fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-white/15 bg-black/40 p-2 shadow-2xl">
              <img
                src={`${TMDB_IMG}/w780${movie.posterPath}`}
                alt={movie.title}
                className="aspect-[2/3] w-full rounded-[20px] object-cover"
              />
            </div>
            <Button className="h-14 w-full rounded-2xl text-base font-bold shadow-xl shadow-primary/30">
              <Ticket className="mr-2 h-5 w-5" />
              Book tickets
            </Button>
          </div>

          <div className="space-y-8">
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant="outline"
                  className="rounded-full border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-wider text-white/85"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Clock3, label: "Runtime", value: formatRuntime(movie.runtime) },
                { icon: Calendar, label: "Release", value: formatReleaseDate(movie.releaseDate) },
                { icon: Globe2, label: "Language", value: movie.language.toUpperCase() },
              ].map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 backdrop-blur-xl"
                >
                  <item.icon className="mb-3 h-5 w-5 text-primary" />
                  <p className="text-xs uppercase tracking-[0.18em] text-white/55">{item.label}</p>
                  <p className="mt-1 text-lg font-semibold">{item.value}</p>
                </article>
              ))}
            </div>

            <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-white/[0.05] to-transparent p-8">
              <h2 className="text-xs uppercase tracking-[0.3em] text-primary">Why this movie</h2>
              <p className="mt-4 text-2xl font-semibold leading-snug text-white/90 md:text-3xl">
                Massive visuals, emotional storytelling, and a cast that lights up every scene.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-28 md:px-12 lg:px-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">Cast & Characters</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/55">Meet the ensemble</p>
          </div>
        </div>

        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
          <CarouselContent>
            {movie.cast.map((person, index) => (
              <CarouselItem
                key={`${person.name}-${index}`}
                className="basis-[78%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#10131b]">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {person.profile_path ? (
                      <img
                        src={`${TMDB_IMG}/w500${person.profile_path}`}
                        alt={person.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/5">
                        <User className="h-16 w-16 text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="truncate text-lg font-semibold">{person.name}</p>
                    <p className="mt-1 truncate text-xs uppercase tracking-[0.15em] text-primary">{person.character}</p>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 hidden border-white/15 bg-black/70 text-white md:flex" />
          <CarouselNext className="-right-4 hidden border-white/15 bg-black/70 text-white md:flex" />
        </Carousel>
      </section>
    </main>
  );
};

const MovieDetailsSkeleton = () => (
  <div className="min-h-screen space-y-8 bg-[#090b11] p-6 md:p-12">
    <Skeleton className="h-[58vh] w-full rounded-3xl" />
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <Skeleton className="aspect-[2/3] w-full rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    </div>
  </div>
);

const ErrorState = ({ refetch }: { refetch: () => void }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-[#090b11] px-6 text-center text-white">
    <div className="mb-6 rounded-full border border-red-500/40 bg-red-500/10 p-5">
      <Clapperboard className="h-12 w-12 text-red-500" />
    </div>
    <h2 className="text-3xl font-black tracking-tight">Couldn&apos;t load movie details</h2>
    <p className="mt-3 max-w-md text-white/60">
      Something interrupted the data stream. Please try again.
    </p>
    <Button onClick={() => refetch()} className="mt-7 rounded-2xl">
      <RefreshCw className="mr-2 h-4 w-4" />
      Retry
    </Button>
  </div>
);

export default MovieDetailsPage;
