'use client'
import {useState} from 'react';
interface UseFormSubmitOptions<TResponse>{
    onSuccess?: (response: TResponse) => void | Promise<void>;
}

export function useFormSubmit<TData, TResponse>(
    submitForm: (data: TData) => Promise<TResponse>,
    options?: UseFormSubmitOptions<TResponse>)
{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleSubmit = async (data: TData) =>{
        setError("");
        setLoading(true);
        try{
            const response = await submitForm(data);
            await options?.onSuccess?.(response);
            return response;
        } catch(err){
            const message = err instanceof Error 
                                ? err.message
                                : "Đã xảy ra lỗi. Vui lòng thử lại!";
            setError(message);
            return null;
        } finally{
            setLoading(false);
        }
    }
    return { loading, error, setError, handleSubmit};
}