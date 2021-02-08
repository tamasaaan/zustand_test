import React, {useCallback, useState, useEffect} from 'react'
import create from 'zustand'
import {useForm} from "react-hook-form";
import { devtools } from 'zustand/middleware'

const useDataStore = create(devtools((set) => ({
    data: {
        person: {
            name: "aaa",
            place: "",
            age: ""
        }
    },
    apply: (v) => set((state) => ({data: {person: v}})),
    send: async (id, form, updateMode) => {
        console.log(form)
        const body = form
        console.log("body", body)
        const response = await fetch(`http://127.0.0.1:3106/users/${id}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            body: {
                person: JSON.stringify(body) // 本文のデータ型は "Content-Type" ヘッダーと一致する必要があります
            } // 本文のデータ型は "Content-Type" ヘッダーと一致する必要があります
        })
        console.log(response.statusText)
        // const data = await response.json()
        set({ data: {person: form}})
        updateMode("detail")
        // (v) => set((state) => ({data: {person: v}})),
    },
    // load  pram id
    load: async id => {
        const response = await fetch(`http://127.0.0.1:3106/users/${id}`)
        const data = await response.json()
        set({ data: data})
    }
})))

// const useDataStore = create(devtools(store))

let renderCount = 0

export default function App() {

    const {data, apply, load, send} = useDataStore()
    const {register, handleSubmit, reset, getValues} = useForm({
        defaultValues: data.person,
    });
    const id = 1234

    useEffect(() => {
        // storeが変わったら毎回reset subscribe
        // 国籍など
        return useDataStore.subscribe(reset, state => state.data.person)
    }, [reset])

    useEffect(() => {
        // 適当なgetapiを使用
        load(id)
    }, [load])

    const [mode, updateMode] = useState("detail")

    const onSubmit = useCallback((form) => {
        console.log("form", form)
        // apply(form)
        send(id, form, updateMode)
        // reset
    }, [apply, updateMode, send])

    const handleReset = useCallback(() => {
        reset(data.person)
    }, [data, reset])

    console.log("data", data)
    console.log("getValues", getValues())
    renderCount++

    return (

        <div style={{backgroundColor: "#fff"}}>
            renderCount:{renderCount}

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

