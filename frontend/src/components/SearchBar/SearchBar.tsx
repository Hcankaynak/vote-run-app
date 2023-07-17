import React from "react";
import Form from "react-bootstrap/Form";
import "./searchBar.scss";

interface ISearchBar {
    setText: (text) => void;
}

const SearchBar = (props: ISearchBar) => {
    const [searchedText, setSearchedText] = React.useState("");

    return (
        <div className="search-bar">
            <Form.Group className="search-bar-group">
                <div className="search-icon">
                    <i className="fas fa-magnifying-glass"></i>
                </div>
                <Form.Control type="search-bar-control"
                              placeholder={"Enter Text"}
                              onChange={(value) => {
                                  setSearchedText(value.target.value)
                                  props.setText(value.target.value);
                              }}/>
            </Form.Group>
        </div>
    )
}

export default SearchBar;
