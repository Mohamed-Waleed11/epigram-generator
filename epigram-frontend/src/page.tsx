import { useState, useEffect } from "react";
import { Container, Box, Button, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GeneratedEpigramCarousel from "./components/GeneratedEpigramCarousel";
import UserEpigramCarousel from "./components/UserEpigramCarousel";
import CreateEpigramModal from "./components/CreateEpigramModal";
import toast, { Toaster } from "react-hot-toast";

export const API_BASE = "http://localhost:8080/api/epigrams";

export default function Home() {
    const [generated, setGenerated] = useState<any>(null);
    const [userEpigrams, setUserEpigrams] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
            primary: { main: "#d4a574" },
            background: { default: "#1a1a2e", paper: "#25253a" },
        },
    });

    async function fetchGenerated() {
        try {
            const res = await fetch(`${API_BASE}/generate`, { method: "POST" });
            const data = await res.json();
            setGenerated(data);
        } catch {
            toast.error("Failed to generate epigram");
        }
    }

    async function fetchUserEpigrams() {
        try {
            const res = await fetch(API_BASE);
            const data = await res.json();
            setUserEpigrams(data);
            setCarouselIndex(0);
        } catch {
            toast.error("Failed to fetch user epigrams");
        }
    }

    useEffect(() => {
        fetchGenerated();
        fetchUserEpigrams();
    }, []);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Toaster position="top-right" />
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <GeneratedEpigramCarousel />

                <Box display="flex" justifyContent="center" sx={{ my: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpen(true)}
                    >
                        Create
                    </Button>
                </Box>

                <CreateEpigramModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onCreated={(newEpigram) => setUserEpigrams((prev) => [newEpigram, ...prev])}
                />

                <UserEpigramCarousel
                    epigrams={userEpigrams}
                    setEpigrams={setUserEpigrams}
                    index={carouselIndex}
                    setIndex={setCarouselIndex}
                />
            </Container>
        </ThemeProvider>
    );
}