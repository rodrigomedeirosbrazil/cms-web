import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';

import graphql from '../services/graphql'
import noPhotoDataUri from '../assets/noPhotoDataUri'

const ITEMS = `
    query {
        items (where: {active: {_eq: true}}, order_by: {idn: asc}) { 
            idn, name, description, quantity, value, picture 
        }
    }
`;

const Catalog = async () => {
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const _data = await graphql(ITEMS);

    var pdf = {
        content: [{
            text: 'Catálogo de produtos',
            style: 'header'
        }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 3, 0, 2]
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        },
    };
    for (let i=0; i < _data.items.length; i++) {
        let item = _data.items[i];
        if (item.picture === '') {
            item.picture = noPhotoDataUri;
        }
        if (!item.height) item.height = '-';
        if (!item.width) item.width = '-';
        if (!item.length) item.length = '-';
        pdf.content.push({
            columns: [{
                image: item.picture,
                width: 100,
                margin: [0, 5]
            }, {
                width: 10,
                text: ''
            },
            [
                {
                    text: item.name + ' #' + item.idn,
                    style: 'subheader',
                },
                `R$ ${item.value}`,
                `Altura: ${item.height} cm - Largura: ${item.width} cm - Profundidade: ${item.length} cm`,
                `Descrição: ${item.description}`,
            ]

            ]
        },
        {
            text: '',
            pageBreak: (((i + 1) % 6) === 0 ? 'after' : ''),
        })
    }

    pdfMake.createPdf(pdf).download('catalogo.pdf');
}

export default Catalog;
