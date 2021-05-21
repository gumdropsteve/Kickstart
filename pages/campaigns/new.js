import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
    state = {
        minimumContribution: '', // assume working with string input from user
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault(); // keep browser from trying to submit form

        this.setState({ loading: true });
        this.setState({ errorMessage: '' }); // clear any existing error(s)

        try {
            // get list of accounts
            const accounts = await web3.eth.getAccounts();
            // create a new campaign
            await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                    // don't have to specify gas amount, metamask will do this
                });

            Router.pushRoute('/'); // send user back to homepage after they create Campaign
        } catch (err) {
            this.setState({ errorMessage: err.message });
        };

        this.setState({ loading: false });
    };

    render() {
        return (
            // no () on {this.onSubmit} because not trying to run function now
            // want to pass ref for future execution 
            // !! turn string into its equivalent bool value
            <Layout>
                <h3>Create a Campaign</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                            label='wei' 
                            labelPosition='right' 
                            value={this.state.minimumContribution}
                            onChange={event => this.setState({ minimumContribution: event.target.value })}
                        />
                    </Form.Field>

                    <Message error header='oops!' content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Create!</Button>
                </Form>
            </Layout>
        )
    }
}

export default CampaignNew;
