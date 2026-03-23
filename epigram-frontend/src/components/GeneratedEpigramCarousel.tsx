import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    IconButton,
} from "@mui/material";
import { ThumbUp, ThumbDown, Delete, PlayArrow, Pause, SkipNext } from "@mui/icons-material";
import { API_BASE } from "../page";

export default function GeneratedEpigramCarousel() {
    const [epigram, setEpigram] = useState<any>(null);
    const [isAutoReload, setIsAutoReload] = useState(true);

    async function fetchGenerated() {
        try {
            const res = await fetch(`${API_BASE}/generate`, { method: "POST" });
            const data = await res.json();
            setEpigram(data);
        } catch {
            console.log("Error generating epigram");
        }
    }

    useEffect(() => {
        fetchGenerated();
    }, []);

    useEffect(() => {
        if (!isAutoReload) return;

        const interval = setInterval(() => {
            fetchGenerated();
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoReload]);

    async function handleLike(id: number) {
        await fetch(`${API_BASE}/${id}/like`, { method: "POST" });
        fetchGenerated();
    }

    async function handleDislike(id: number) {
        await fetch(`${API_BASE}/${id}/dislike`, { method: "POST" });
        fetchGenerated();
    }

    async function handleDelete(id: number) {
        await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        fetchGenerated();
    }

    if (!epigram) return <div>Loading...</div>;

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" align="center" fontWeight="bold">
                    Auto-generated Epigrams
                </Typography>

                <Typography variant="h5" fontStyle="italic" align="center">
                    "{epigram.text}"
                </Typography>

                <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={isAutoReload ? <Pause /> : <PlayArrow />}
                        onClick={() => setIsAutoReload(!isAutoReload)}
                    >
                        {isAutoReload ? "Pause" : "Play"}
                    </Button>

                    <Button variant="outlined" onClick={fetchGenerated} sx={{ ml: 2 }} startIcon={<SkipNext />}>
                        Next
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}