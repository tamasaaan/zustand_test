import React, {useCallback, useState} from 'react'
import create from 'zustand'
import {DevTool} from "@hookform/devtools";
import {useForm} from "react-hook-form";

const useApplyStore = create((set) => ({
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
const Counter = () => {

    const [mode, updateMode] = useState("detail")
    const {data, apply} = useApplyStore()

    const method = useForm({
        mode: "onBlur",
        defaultValues: data,
        shouldUnregister: false
    })
    const {handleSubmit, control, register, reset, getValues} = method

    const onSubmit = useCallback((data) => {
        apply(data)
        updateMode("detail")
    }, [apply, updateMode])
    renderCount++
    console.log(mode)

    const handleReset = useCallback(() => reset(), [reset])

    console.log("data", data)
    console.log("getValues", getValues())

    return (

        <div className="counter">

            <DevTool control={control}/>

            <div>
                <span>renderCount:{renderCount}</span>
            </div>

            {
                mode === "edit" ?

                    <>
                        <div>
                            <input name="name" ref={register}/>
                            <input name="place" ref={register}/>
                            <input name="age" ref={register}/>
                            <button type={"submit"} onClick={handleSubmit(onSubmit)}>submit</button>
                            <button onClick={handleReset}>cancel</button>
                        </div>
                    </>
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
    )

}

export default function App() {
    return (
        <>
            <div className="main">
                <div className="code">
                    <div className="code-container">
                        <Counter/>
                    </div>
                </div>
            </div>
        </>
    )
}
