import React, {useCallback, useState, useEffect} from 'react'
import create from 'zustand'
import {useForm} from "react-hook-form";

const useDataStore = create((set) => ({
    data: {
        person: {
            name: "aaa",
            place: "",
            age: ""
        }
    },
    apply: (v) => set((state) => ({data: {person: v}}))
}))

let renderCount = 0

export default function App() {

    const {data, apply} = useDataStore()
    const {register, handleSubmit, reset, getValues} = useForm({
        defaultValues: data.person,
    });
    useEffect(() => {
        const id = 1234
        fetch(`http://127.0.0.1:3105/users/${id}`)
            .then(response => response.json())
            .then(res => {
                console.log("api", res)
                apply(res.person)
                reset(res.person)
            });
    }, [apply])

    const [mode, updateMode] = useState("detail")

    const onSubmit = useCallback((form) => {
        console.log("form", form)
        apply(form)
        updateMode("detail")
        reset(form)
    }, [apply, updateMode, reset])

    const handleReset = useCallback(() => {
        reset(data.person)
    }, [data, reset])

    console.log("data", data)
    console.log("getValues", getValues())
    renderCount++

    return (

        <div style={{backgroundColor: "#fff"}}>
            {renderCount}

            {
                mode === "edit" ?

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <input name="name" ref={register({required:true})} placeholder="First name"/>

                        <input name="place" ref={register} placeholder="Last name"/>

                        <select name="age" ref={register}>
                            <option value=""/>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                        </select>

                        <input type="submit"/>
                        <button onClick={handleReset}>cancel</button>
                    </form>
                    :
                    <>
                        <div>
                            <input type="text" value={data.person.name} disabled/>
                            <input type="text" value={data.person.place} disabled/>
                            <input type="text" value={data.person.age} disabled/>
                            <button onClick={() => updateMode("edit")}>edit</button>
                        </div>
                    </>

            }

        </div>
    );
}

