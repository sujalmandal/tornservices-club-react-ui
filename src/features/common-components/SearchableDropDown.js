import React, { useState, useEffect } from 'react';
import { FormControl ,Dropdown } from 'react-bootstrap';
import FuzzySet from 'fuzzyset'

export default function SearchableDropDown(props) {

    const [currentAvailableTemplateIndex,setCurrentAvailableTemplateIndex]=useState(0);
    const [selectedTemplateKey, setSelectedTemplateKey] = useState("--select--");

    const Toggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
          &#x25bc;
        </a>
    ));

    // forwardRef again here!
    // Dropdown needs access to the DOM of the Menu to measure it
    const Menu = React.forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
            const [value, setValue] = useState('');
            return (
                <div
                    ref={ref}
                    style={style}
                    className={className}
                    aria-labelledby={labeledBy}
                    style={{maxHeight:"75vh"}}
                >
                    <FormControl
                        autoFocus
                        className="mx-3 my-2 w-auto"
                        placeholder="Type to filter..."
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                    />
                    <ul className="list-unstyled pre-scrollable">
                        {
                        React.Children.toArray(children).filter(
                            (child) =>{
                                var listText=child.props.children.props.children;
                                if(!value){
                                    return true;
                                }
                                else if(value.length>2){
                                    var fuzzySetObj=FuzzySet([listText]);
                                    var matchResult=fuzzySetObj.get(value);
                                    return (matchResult!==null);
                                }
                                else 
                                    return true;
                            }
                        )}
                    </ul>
                </div>
            );
        },
    );

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle as={Toggle} id="dropdown-custom-components">
                    {props.options !== undefined ?
                        props.options[currentAvailableTemplateIndex] : ""}
                    {' '}
                </Dropdown.Toggle>
                <Dropdown.Menu as={Menu}>
                    {props.options !== undefined ? props.options.map((item, index) => {
                        return <><Dropdown.Item
                            active={currentAvailableTemplateIndex == index}
                            eventKey={index}
                        >
                            {item}
                        </Dropdown.Item></>
                    }) : ""}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}