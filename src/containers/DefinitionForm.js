import React, { useState, useEffect } from 'react'

import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

import TagsInput from 'react-tagsinput'
import Autosuggest from 'react-autosuggest'

import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.
import "./DefinitionForm.css";

import { firebaseApp } from '../App'

import _ from 'lodash'


const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});


const DefinitionForm = ({ data, id = null, definition = null }) => {

    const isCreating = !id

    const [title, setTitle] = useState(isCreating ? "" : definition.title)
    const [imageUrl, setImageUrl] = useState(isCreating ? "" : definition.imageUrl)
    const [tags, setTags] = useState(isCreating ? [] : definition.tags)

    const [markdownValue, setMarkdown] = useState(isCreating ? "" : definition.text)
    const [selectedTab, setSelectedTab] = React.useState("write");

    const [loading, setLoading] = useState(false)

    const savedTags = []
    data.forEach(definition => {
      definition.tags.forEach(tag => {
        savedTags.push(tag)
      })
    })

    return (
        <div id="content-wrapper">
            <div id="inputs">
                <div className="input-line">
                    <span>Titulo</span>
                    <input type="text" value={title} onChange={({ target }) => setTitle(target.value)} disabled={loading} />
                </div>
                <div className="input-line">
                    <span>Imagem</span>
                    <input type="text" value={imageUrl} onChange={({ target }) => setImageUrl(target.value)} disabled={loading} />
                </div>
                <div id="image-preview">
                  <img src={imageUrl} />
                </div>
                <ReactMde
                    value={markdownValue}
                    onChange={setMarkdown}
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    generateMarkdownPreview={markdown =>  Promise.resolve(converter.makeHtml(markdown))}
                    disabled={loading}
                />
                <div className="input-line">
                    <span>Tags</span>
                    <TagsInput
                        disabled={loading}
                        value={tags}
                        onChange={setTags}
                        renderInput={(args) => autosuggestRenderInput(_.uniq(savedTags), args)}
                    />
                </div>

                <input id="submit-button" type="submit" value="Salvar" onClick={() => onSubmit({
                    tags, title, imageUrl, markdownValue, setLoading, id
                  })
                }/>
            </div>
            {loading && (
              <div>
                <span>Loading...</span>
              </div>
            )}
        </div>
    )
}

async function onSubmit({ tags, title, imageUrl, markdownValue, setLoading, id }) {
  console.log("Submit!")

  setLoading(true)

  try {
    const db = firebaseApp.firestore()

    let docRef = id ? db.collection('definitions').doc(id) : db.collection('definitions').doc()

    let insertQuery = {
      title,
      imageUrl,
      tags,
      text: markdownValue,
    }

    if (!id) {
      insertQuery.featured = false
      insertQuery.likes = 0
      insertQuery.dislikes = 0
      insertQuery.faq = []
      insertQuery.references = []
      insertQuery.source = ""
      insertQuery.color = "lightblue"
    }
  
    await docRef.set(insertQuery, { merge: true })
  
    alert('Salvo com sucesso!')

  } catch (e) {

    alert('um erro aconteceu')

  } finally {
    setLoading(false)
  }


}

function autosuggestRenderInput(savedTags, { addTag, ...props }) {
    const handleOnChange = (e, { method }) => {
      if (method === 'enter') {
        e.preventDefault()
      } else {
        props.onChange(e)
      }
    }
  
    const inputValue = (props.value && props.value.trim().toLowerCase()) || ''
    const inputLength = inputValue.length
  
    let suggestions = savedTags.filter((tag) => {
      return tag.toLowerCase().slice(0, inputLength) === inputValue
    })
  
    return (
      <Autosuggest
        ref={props.ref}
        suggestions={suggestions}
        shouldRenderSuggestions={(value) => value && value.trim().length > 0}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={(suggestion) => <span>{suggestion}</span>}
        inputProps={{...props, onChange: handleOnChange}}
        onSuggestionSelected={(e, {suggestion}) => {
          addTag(suggestion)
        }}
        onSuggestionsClearRequested={() => {}}
        onSuggestionsFetchRequested={() => {}}
      />
    )
  }


export default DefinitionForm;
