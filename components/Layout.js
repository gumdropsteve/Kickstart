import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';

const Layout = (props) => {
    // props.children comes from everything between <Layout></Layout> (e.g. in index.js)
    return (
        <Container>
            <Head>
                <link async rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"/>
            </Head>
            <Header />
            {props.children}
        </Container>
    )
};

export default Layout;