import { number, string } from 'joi';

export const SettingsSchema = {
    set: {
        payload: {
            Language: string().required().min(2).max(5),
            YearFrom: number().required().min(2010).max(2030),
            YearTo: number().required().min(2010).max(2030)
        }
    }
}
