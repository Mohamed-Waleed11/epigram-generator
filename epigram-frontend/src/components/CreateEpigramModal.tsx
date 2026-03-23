import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { ControlledTextField } from "./ControlledTextField";
import { API_BASE } from "../page";
import toast from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
    text: yup.string().required("Text is required"),
    author: yup.string().required("Author is required"),
});

export default function CreateEpigramModal({ open, onClose, onCreated }) {
    const { control, handleSubmit, reset, formState: { isValid, isSubmitting } } = useForm({
        defaultValues: { text: "", author: "" },
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    async function onSubmit(data) {
        try {
            const res = await fetch(`${API_BASE}/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const created = await res.json();

            reset();
            onClose();

            onCreated(created);

            toast.success("Epigram created successfully");
        } catch (e) {
            console.log(e);
            toast.error("Something went wrong");
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Create Epigram</DialogTitle>

            <DialogContent>
                <form id="create-form" onSubmit={handleSubmit(onSubmit)}>
                    <ControlledTextField
                        name="text"
                        control={control}
                        label="Text"
                        multiline
                        rows={3}
                        sx={{ mb: 2, mt: 2}}
                    />

                    <ControlledTextField
                        name="author"
                        control={control}
                        label="Author"
                    />
                </form>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => {
                    onClose()
                    reset()
                }}>Cancel</Button>
                <Button type="submit" form="create-form" variant="contained" disabled={!isValid || isSubmitting}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}