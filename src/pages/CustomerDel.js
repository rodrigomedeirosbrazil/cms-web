import React, { useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useParams } from "react-router";

const UPDATECUSTOMER = gql`
    mutation ($id: Int!) {
        update_customers(where: {id: {_eq: $id}}, _set: {active: false}) {
            affected_rows
        }
    }
`;

export default function CustomerRegister({ history }) {
    let { id } = useParams();

    const [ updateCustomer ] =
        useMutation(
            UPDATECUSTOMER,
            {
                variables: { id },
                onCompleted: () => {
                    history.goBack();
                }
            }
        );

    useEffect(
        () => {
            updateCustomer();
        },
        []
    )

    return (<></>);
}