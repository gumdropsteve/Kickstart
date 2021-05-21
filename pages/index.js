import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true // every card stretch entire width of its container
            }
        });

        return <Card.Group items={items} />;
    }
    
    render() {
        // anchor tag wrapping Button makes it clickable
        // Link tag gives up the functionality
        return (
            <Layout>
            <div>
                <h3>Open Campaigns</h3>

                <Link route='campaigns/new'>
                    <a>
                    <Button 
                        floated='right'
                        content='Create Campaign'
                        icon='add circle'
                        primary // same as: primary={true}
                    />
                    </a>
                </Link>

                {this.renderCampaigns()}
            </div>
            </Layout>);
    }
}

export default CampaignIndex;
