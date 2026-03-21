import {type Control, Controller} from "react-hook-form";
import {TextField} from "@mui/material";


type ControlledTextFieldProps = {
    name: keyof FormData;
    control: Control<FormData>;
    label: string;
} & any;

export function ControlledTextField({name, control, label, ...props}: ControlledTextFieldProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    label={label}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    {...props}
                />
            )}
        />
    );
}