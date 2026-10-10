'use client'
import {useState} from 'react'
import type {ChangeEvent} from 'react'
type FormFieldElement = |HTMLInputElement |HTMLTextAreaElement | HTMLSelectElement;

export function useFormFields<T extends object>(initialValue: T){
    const [values, setValues] = useState<T>(initialValue);
    const handleChange = (e: ChangeEvent<FormFieldElement>) =>{
        const target = e.target;
        const value = target instanceof HTMLInputElement
                   && target.type === "checkbox" ? target.checked : target.value;
        setValues((pre) => ({
            ...pre,
            [target.name]: value,
        }));
    }
    return {values, setValues, handleChange,};
}