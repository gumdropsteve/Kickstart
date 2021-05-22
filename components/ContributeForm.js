import { Component } from "react";
import { Form, Input, Button, Message } from "semantic-ui-react";
import Campaign from '../ethereum/campaign';
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class ContributeForm extends Component {
    state = {
        value: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async event => {
        event.preventDefault();

        const campaign = Campaign(this.props.address);

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether') // input as ether, convert to wei
            });

            Router.replaceRoute(`/campaigns/${this.props.address}`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false, value: '' });
    };

    render() {
        // no () on this.onSubmit b/c passing a ref for later execution (same elsewhere prior)
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} >
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input 
                        label='ether' // 1 ether = 1x10^18 wei, make it easier for people to blow racks
                        labelPosition='right'
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                    />
                </Form.Field>

                <Message error header='oops!' content={this.state.errorMessage} />
                <Button primary loading={this.state.loading}>Contribute!</Button>
            </Form>
        );
    }
}

export default ContributeForm;
