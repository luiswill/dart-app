import React from 'react';
import './ButtonPoint.css';

import {Button} from 'reactstrap';

class ButtonPoint extends React.Component {
    constructor(props) {
        super();
        this.state = {
            dartPoints: props.value
        }
    }


    render() {
        return(
            <Button outline size="lg" color="success" onClick={this.props.onClick}>{this.state.dartPoints}</Button>
        );
    }

}

export default ButtonPoint;