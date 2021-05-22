import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';
import Layout from '../../components/Layout';
import Campaign from  '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';

class CampaignShow extends Component {
    static async getInitialProps(props) { // different props object than ends up in instance, from wildcard (routes.js)
        const campaign = Campaign(props.query.address);
        
        const summary = await campaign.methods.getSummary().call(); // object, not array

        return {
            address: props.query.address,
            minimumContribution: summary[0], // still access like array
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props;
        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'This address (the Manager) created this campaign and can create requests to withdraw money.',
                style: { overflowWrap: 'break-word' } // break words that don't fit
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to back this campaign.'
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'The Manager has made this many requests to withdraw money from this campaign.'
            },
            {
                header: approversCount,
                meta: 'Number of Backers',
                description: 'This campaign has this many Backers, at least 1/2 must approve a withdraw request for it to be executable.'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance of how much money this campaign has left to spend.'
            },
        ];

        return <Card.Group items={items}/>
    }

    render() {
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>

                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    <Grid.Row>

                    </Grid.Row>
                </Grid>

            </Layout>
        );
    }
}

export default CampaignShow;
