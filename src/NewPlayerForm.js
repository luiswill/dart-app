import React from 'react';
import { Input} from 'reactstrap';

class NewPlayerForm extends React.Component {
    constructor(props) {
        super();

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.handleChange(e.target.value);
    }

    render() {
        return (

              <Input name="playerSelection" type="select" onChange={this.handleChange}>
                  <option value="Benny">Benny</option>
                  <option value="Jonas">Jonas</option>
                  <option value="Alex">Alex</option>
              </Input>


        );
    }

}

export default NewPlayerForm;