import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    IconButton,
} from "@mui/material";
import { PlayArrow, Pause, SkipNext, ThumbUp, ThumbDown, Delete } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE } from "../page";

interface Props {
    epigrams: any[];
    setEpigrams: (epigrams: any[]) => void;
    index: number;
    setIndex: (i: number) => void;
}

export default function UserEpigramCarousel({ epigrams, setEpigrams, index, setIndex }: Props) {
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!isPlaying || epigrams.length === 0) return;

        const interval = setInterval(() => {
            setIndex((i) => (i + 1) % epigrams.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPlaying, epigrams, setIndex]);

    useEffect(() => {
        if (index >= epigrams.length) {
            setIndex(epigrams.length === 0 ? 0 : epigrams.length - 1);
        }
    }, [epigrams, index, setIndex]);

    if (epigrams.length === 0) return <div>No epigrams yet</div>;

    const current = epigrams[index];

    async function handleLike(id: number) {
        setEpigrams((prev) => prev.map((e) => (e.id === id ? { ...e, likes: e.likes + 1 } : e)));

        try {
            await fetch(`${API_BASE}/${id}/like`, { method: "POST" });
        } catch {
            toast.error("Could not like epigram");
        }
    }

    async function handleDislike(id: number) {
        setEpigrams((prev) =>
            prev.map((e) => (e.id === id ? { ...e, dislikes: e.dislikes + 1 } : e))
        );
        try {
            await fetch(`${API_BASE}/${id}/dislike`, { method: "POST" });
        } catch {
            toast.error("Could not dislike epigram");
        }
    }

    async function handleDelete(id: number) {
        setEpigrams((prev) => prev.filter((e) => e.id !== id));
        try {
            await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
            setIndex((i) => {
                if (epigrams.length === 1) return 0;
                return i >= epigrams.length - 1 ? 0 : i;
            });
        } catch {
            toast.error("Could not delete epigram");
        }
    }

    return (
        <>
            <Toaster position="top-right" />
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h5" align="center" fontWeight="bold">
                        User Generated Epigrams
                    </Typography>

                    <Typography variant="h5" fontStyle="italic" align="center" sx={{ mt: 2 }}>
                        "{current?.text}"
                    </Typography>

                    {current.author && (
                        <Typography align="center" color="text.secondary">
                            — {current.author}
                        </Typography>
                    )}

                    <Typography align="center" color="text.secondary" sx={{ mt: 1 }}>
                        {`${index + 1} / ${epigrams.length}`}
                    </Typography>

                    <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 2 }}>
                        <Button startIcon={<ThumbUp />} onClick={() => handleLike(current.id)}>
                            {current.likes}
                        </Button>

                        <Button startIcon={<ThumbDown />} onClick={() => handleDislike(current.id)}>
                            {current.dislikes}
                        </Button>

                        <IconButton color="error" onClick={() => handleDelete(current.id)}>
                            <Delete />
                        </IconButton>
                    </Stack>

                    <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            {isPlaying ? "Pause" : "Play"}
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<SkipNext />}
                            onClick={() => setIndex((i) => (i + 1) % epigrams.length)}
                        >
                            Next
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
}