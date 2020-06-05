import React, { useState } from 'react'
import './ListDefinitions.css'

import { firebaseApp } from '../App'

import { Definition } from '../models'

import DefinitionForm from './DefinitionForm'

type Props = {
    data: Definition[],
    reloadData: Function
}

const changeFeatured = async (definitionId: string, value: boolean) => {
    try {

        const db = firebaseApp.firestore()
        const doc = db.collection('definitions').doc(definitionId)

        await doc.set({
            featured: value
        }, { merge: true })

        alert("Atualizado!")

    } catch (e) {

        console.warn(e)
        alert("Erro!")
    }
}

const deleteDefinition = async (definitionId: string) => {
    try {

        const db = firebaseApp.firestore()
        const doc = db.collection('definitions').doc(definitionId)

        await doc.delete()

        alert("Removido!")

    } catch (e) {

        console.warn(e)
        alert("Erro!")
    }
}

const ListDefitions = (props: Props) => {

    const [editing, setEditing] = useState("")
    const [search, setSearch] = useState("")

    const renderList = () => {
        return props.data.map((def: Definition) => {

            if (search !== "" && !def.title.toLowerCase().trim().includes(search.toLowerCase().trim())) {
                return
            }

            const isSelected = editing === def.id

            return (
                <div className="definition-card" key={def.id}>
                    <span>{def.title}</span>
                    <div>
                        <span>Featured</span>
                        <input type="checkbox" checked={def.featured} onChange={async ({ target }) => {
                            await changeFeatured(def.id, target.checked)
                            props.reloadData()
                        }} />
                    </div>
                    <span
                        style={{ color: isSelected ? 'red' : '#367942', cursor: 'pointer' }}
                        onClick={() => { isSelected ? setEditing("") : setEditing(def.id) }}
                    >
                        {isSelected ? 'Voltar' : 'Editar'}
                    </span>
                    <span
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={() => {
                            deleteDefinition(def.id)
                            props.reloadData()
                        }}
                    >
                        Excluir
                    </span>
                    {editing === def.id ? (
                        <div>
                            <DefinitionForm data={props.data} id={def.id} definition={def}/>
                        </div>
                    ) : null}
                </div>
            )
        })
    }

    return (
        <div id="list-container">
            <div>
                <input type="text" value={search} onChange={({ target }) => { setSearch(target.value) }} />
                <button style={{ marginLeft: 20, height: 27, width: 100 }} onClick={() => { props.reloadData() }}>
                    Recarregar
                </button>
                {editing !== "" && <button style={{ marginLeft: 20, height: 27, width: 100 }} onClick={() => { setEditing("") }}>
                    Fechar
                </button>}
            </div>
            {renderList()}
        </div>
    )
}

export default ListDefitions
