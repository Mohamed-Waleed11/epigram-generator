"use client";

import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    Stack,
    IconButton,
    createTheme,
    ThemeProvider,
    CssBaseline,
} from "@mui/material";
import {
    ThumbUp,
    ThumbDown,
    Delete,
    PlayArrow,
    Pause,
    SkipNext,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {ControlledTextField} from "./components/ControlledTextField.tsx";
import toast, {Toaster} from "react-hot-toast";

const API_BASE = "http://localhost:8080/api/epigrams";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#d4a574" },
        background: { default: "#1a1a2e", paper: "#25253a" },
    },
});

interface Epigram {
    id: number;
    text: string;
    author: string;
    likes: number;
    dislikes: number;
}

type FormData = {
    text: string;
    author: string;
};

const schema = yup.object({
    text: yup.string().required("Text is required").min(3, "Minimum 3 characters"),
    author: yup.string().required("Author is required").max(50, "Too long"),
});

export default function Home() {
    const [epigrams, setEpigrams] = useState<Epigram[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const current = epigrams[currentIndex] ?? null;

    const {control, handleSubmit, reset, formState: { isSubmitting }} = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            text: "",
            author: "",
        },
    });

    useEffect(() => {
        fetchEpigrams();
    }, []);

    useEffect(() => {
        if (!isPlaying || epigrams.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((i) => epigrams.length === 0 ? 0 : (i + 1) % epigrams.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPlaying, epigrams.length]);

    async function fetchEpigrams() {
        try {
            const res = await fetch(API_BASE);
            const data = await res.json();
            setEpigrams(Array.isArray(data) ? data : []);
        } catch {
            console.log("Could not connect to backend");
        }
    }

    const onSubmit = async (data: FormData) => {
        try {
            await fetch(`${API_BASE}/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: data.text,
                    author: data.author,
                }),
            });

            reset();
            await fetchEpigrams();
            toast.success("Successfully created epigram")
        } catch {
            toast.error("Could not create epigram")
        }
    }

    async function handleLike(id: number) {
        try {
            await fetch(`${API_BASE}/${id}/like`, { method: "POST" });
            await fetchEpigrams();
        } catch {
            console.log("Could not like epigram");
        }
    }

    async function handleDislike(id: number) {
        try {
            await fetch(`${API_BASE}/${id}/dislike`, { method: "POST" });
            await fetchEpigrams();
        } catch {
            console.log("Could not dislike epigram");
        }
    }

    async function handleDelete(id: number) {
        try {
            await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
            fetchEpigrams();
            if (currentIndex >= epigrams.length - 1) setCurrentIndex(0);
            toast.success("Successfully deleted epigram")
        } catch {
            toast.error("Could not delete epigram")
        }
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Toaster position="top-right" />
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Typography variant="h3" align="center" gutterBottom>
                    Epigrams
                </Typography>

                <Card sx={{ minHeight: 200, mb: 3 }}>
                    <CardContent>
                        {current ? (
                            <Box textAlign="center">
                                <Typography variant="h5" fontStyle="italic" sx={{ mb: 2 }}>
                                    "{current.text}"
                                </Typography>
                                {current.author && (
                                    <Typography color="text.secondary">
                                        — {current.author}
                                    </Typography>
                                )}
                                <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 3 }}>
                                    <Button
                                        startIcon={<ThumbUp />}
                                        onClick={() => handleLike(current.id)}
                                    >
                                        {current.likes}
                                    </Button>
                                    <Button
                                        startIcon={<ThumbDown />}
                                        onClick={() => handleDislike(current.id)}
                                    >
                                        {current.dislikes}
                                    </Button>
                                    <IconButton color="error" onClick={() => handleDelete(current.id)}>
                                        <Delete />
                                    </IconButton>
                                </Stack>
                            </Box>
                        ) : (
                            <Typography color="text.secondary" align="center">
                                No epigrams yet
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mb: 3 }}>
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
                        onClick={() =>
                            setCurrentIndex((i) =>
                                epigrams.length === 0 ? 0 : (i + 1) % epigrams.length
                            )
                        }
                        disabled={epigrams.length === 0}
                    >
                        Next
                    </Button>
                    <Typography color="text.secondary">
                        {epigrams.length > 0 ? `${currentIndex + 1} / ${epigrams.length}` : "0 / 0"}
                    </Typography>
                </Stack>

                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Add New Epigram
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                            <ControlledTextField
                                name="text"
                                control={control}
                                label="Epigram text"
                                multiline
                                rows={3}
                                sx={{ mb: 2 }}
                            />

                            <ControlledTextField
                                name="author"
                                control={control}
                                label="Author (optional)"
                                sx={{ mb: 2 }}
                            />

                            <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                                Submit
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </ThemeProvider>
    );
}