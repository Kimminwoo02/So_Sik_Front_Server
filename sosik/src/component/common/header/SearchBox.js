import React, { useEffect, useState } from "react";
import './searchbox.css'
import styled from "styled-components";
import axios from "axios";


const SearchBox = () => {
  
  const [wholeTextArray,setWholeTextArray] = useState([""])
  const [inputValue, setInputValue] = useState('')
  const [isHaveInputValue, setIsHaveInputValue] = useState(false)
  const [dropDownList, setDropDownList] = useState(wholeTextArray)
  const [dropDownItemIndex, setDropDownItemIndex] = useState(-1)

  const clickDropDownItem = clickedItem => {
    setInputValue(() => clickedItem)
    setIsHaveInputValue(() => false)
  }

  const changeInputValue = event => {
    setInputValue(() => event.target.value)

    
    const params = {
      "inputValue": event.target.value
    }

    try {
      console.log("음식 검색========"+event.target.value)
      axios({
        url: 'http://localhost:5056/food/v1/search', 
        params: params
      })
      .then(function (res) {
        console.log(res.data.result)
        if (res.data === null){
          return 
        }
        else{
          setDropDownList(()=>{
            const array = res.data.result
            return array.map((data) => {
              console.log(data.name)
              return  data.name
            })
          })
        }

      
        
        
      })
    } catch (error) {
      console.error("가입에 실패하였습니다. 잠시 후 다시 시도해주세요", error); // 오류 처리
    }
    setIsHaveInputValue(() => true)
  }

  const showDropDownList = () => {
    if (inputValue === '') {
      setIsHaveInputValue(() => false)
      setDropDownList(() => [])
    } 
    else {
      const choosenTextList = wholeTextArray.filter(textItem =>
        textItem.includes(inputValue)
      )
      setDropDownList(() => choosenTextList)
    }
  }

  const handleDropDownKey = event => {
    //input에 값이 있을때만 작동
    if (isHaveInputValue) {
      if (
        event.key === 'ArrowDown' &&
        dropDownList.length - 1 > dropDownItemIndex
      ) {
        setDropDownItemIndex(() => dropDownItemIndex + 1)
      }

      if (event.key === 'ArrowUp' && dropDownItemIndex >= 0)
        setDropDownItemIndex(() => dropDownItemIndex - 1)
      if (event.key === 'Enter' && dropDownItemIndex >= 0) {
        clickDropDownItem(dropDownList[dropDownItemIndex])
        setDropDownItemIndex(() => -1)
      }
    }
  }


  useEffect(showDropDownList, [inputValue])


    return (
      <WholeBox>
        <InputBox isHaveInputValue={isHaveInputValue}>
          <Input
            type='text'
            value={inputValue}
            onChange={changeInputValue}
            onKeyUp={handleDropDownKey}
            placeholder="궁금한 음식 정보를 검색해주세요."
          />
          <DeleteButton onClick={() => setInputValue('')}>&times;</DeleteButton>
        </InputBox>
        {isHaveInputValue && (
          <DropDownBox>
            {dropDownList.length === 0 && (
              <DropDownItem>해당하는 단어가 없습니다</DropDownItem>
            )}
            {dropDownList.map((dropDownItem, dropDownIndex) => {
              return (
                <DropDownItem
                  key={dropDownIndex}
                  onClick={() => clickDropDownItem(dropDownItem)}
                  onMouseOver={() => setDropDownItemIndex(dropDownIndex)}
                  className={
                    dropDownItemIndex === dropDownIndex ? 'selected' : ''
                  }
                >
                  {dropDownItem}
                </DropDownItem>
              )
            })}
          </DropDownBox>
        )}
      </WholeBox>
    )
    
};


const activeBorderRadius = '16px 16px 0 0'
const inactiveBorderRadius = '16px 16px 16px 16px'

const WholeBox = styled.div`
  padding: 10px;
`
const InputBox = styled.div`
  position : absolute;
  margin-left : -18%;
  top: 20px;
  width: 35%;
  display: flex;
  flex-direction: row;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: ${props =>
    props.isHaveInputValue ? activeBorderRadius : inactiveBorderRadius};
  z-index: 3;


`

const Input = styled.input`
  flex: 1 0 0;
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 16px;
`

const DeleteButton = styled.div`
  cursor: pointer;
`

const DropDownBox = styled.ul`
  position : absolute;
  margin-left : -18%;
  width: 35%;
  top: 70px;
  display: block;
  padding: 8px 0;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-top: none;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 10px 10px rgb(0, 0, 0, 0.3);
  list-style-type: none;
  z-index: 3;
`

const DropDownItem = styled.li`
  padding: 0 16px;

  &.selected {
    background-color: lightgray;
  }
`

export default SearchBox;
