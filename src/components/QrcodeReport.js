
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';

import graphql from '../services/graphql'

const ITEMS_BY_NAME = `
    query ($search: String!) {
        items (where: {name: {_ilike: $search}, active: {_eq: true}}, order_by: {idn: asc}) { 
            id, name
        }
    }
`;

const QrcodeReport = ({search}) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (!search) return;

        setLoading(true);

        try {
            const _data = await graphql(
                ITEMS_BY_NAME,
                { search: `%${search.replace(/\s/g, '%')}%` }
            );

            generatePages(_data.items);

        } catch (error) {
            console.log('graphql error', error);
        }

        setLoading(false);
    }

    const generatePages = async (items) => {
        const { vfs } = vfsFonts.pdfMake;
        pdfMake.vfs = vfs;

        const chunk = (arr, size) =>
            Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
                arr.slice(i * size, i * size + size)
            );
        
        const itemsChunks = chunk(items, 5);

        const pdf = {
            pageMargins: 20,
            content: itemsChunks.map(itemsChunk => (
                {
                    columnGap: 5,
                    columns: itemsChunk.map(item => (
                        [
                            {
                                qr: item.id,
                                fit: 80,
                                alignment: 'center',
                            },
                            {
                                text: item.name,
                                fontSize: 8,
                                alignment: 'center',
                                margin: [0, 5]
                            }
                        ]
                    ))
                }
            ))
        };

        pdfMake.createPdf(pdf).download('qrcodes.pdf');
    }

    return (
        <>
            <button onClick={handleClick} disabled={loading || !search } type="button" className="btn btn-primary">
                {loading ? (<div className="spinner-border spinner-border-sm" role="status"></div>)
                    : (<span><FontAwesomeIcon icon={faFile} size="lg" /></span>)}
            </button>
        </>
    )  
}

export default QrcodeReport;