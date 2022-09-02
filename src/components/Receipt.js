import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';
import 'moment/locale/pt-br'; 

import dotToComma from '../utils/dotToComma';
import normalizeCurrency from '../utils/normalizeCurrency';
import normalizeDoc from '../utils/normalizeDoc';
import nullToEmpty from '../utils/nullToEmpty';
import api from '../services/api';
import { getAuth } from '../services/auth';

const normalizeCurrencyDotToComma = value => {
    return value === null || value === undefined 
        ? '0,00'
        : normalizeCurrency(dotToComma(value));
}

const Receipt = async _data => {
    const auth = getAuth();
    const response = await api.get('/auth/me',
        {
            headers: {
                Authorization: 'Bearer ' + (auth ? auth.token : '')
            }
        }
    );
    if (response.status !== 200) return;

    const { email, social_name, fantasy_name, phone, doc, logo, zip, address, neighborhood, city, state } = response.data;
    const completeDate = moment(_data.date_pickup).format('D [de] MMMM [de] YYYY')
    const datePickupFormatted = moment(_data.date_pickup).format('DD/MM/YYYY')
    const dateBackFormatted = moment(_data.date_back).format('DD/MM/YYYY')
    const normalizedDoc = normalizeDoc(doc)
    const totalValueToPayFormatted = normalizeCurrencyDotToComma(_data.total - Number(_data.deposit))
    const totalValueFormatted = normalizeCurrencyDotToComma(_data.total + (
        (Number(_data.discount) && Number(_data.discount) > 0) 
        ? Number(_data.discount) 
        : 0)
    )

    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const contractText = [{ text: '\nCONTRATO DE LOCAÇÃO', fontSize: 18, alignment: 'center' },
        { text: `
        
        As partes identificadas acima têm, entre si, justo e acertado, o presente Contrato de Locação, que se regerá pelas cláusulas seguintes e pelas condições de preço, forma e termos de pagamento descritos no presente.

        2. OBRIGAÇÕES DO LOCADOR

        Cláusula 1ª: É objeto do presente contrato a locação dos bens móveis relacionados, conforme orçamento apresentado e aprovado pela(o) locatária(o). Cláusula 2ª: A locação terá início em ${datePickupFormatted} a partir da retirada das peças das 9:00 as 17:00 hrs de segunda a quinta e 9:00 às 18:00 horas sexta-feira, com devolução agendada para ${dateBackFormatted}, de 09h às 17:00 Hrs. Parágrafo primeiro. A LOCADORA se compromete a entregar os produtos em perfeito estado de conservação e uso, na data estabelecida na cláusula 2ª. Parágrafo segundo. Caso seja constatado dano em algum dos produtos locados, no momento da locação, a LOCADORA se compromete a efetuar a substituição ou troca, independente do seu preço de locação, ou a devida devolução do valor pago pelo aluguel da peça danificada, tudo conforme a disponibilidade do produto ou conveniência da LOCADORA.

        3. DO INADIMPLEMENTO, DO DESCUMPRIMENTO E DA MULTA

        Cláusula 3ª: A presente locação terá o valor de R$ ${totalValueToPayFormatted} pelo período contratado, referente aos bens efetivamente locados, devendo ser integralmente pago, mediante cartão de débito/crédito, dinheiro ou depósito/transferência na CONTA N 22.833-1, Agência 8158 - Banco Itaú  na data da reserva das peças, no caso da(o) cliente optar pelo depósito/transferência, a apresentação do comprovante é indispensável para a retirada das peças locadas. PARÁGRAFO PRIMEIRO. A(O) LOCATÁRIA(O) PODERÁ FAZER RESERVA ANTECIPADA DOS PRODUTOS MEDIANTE O PAGAMENTO ANTECIPADO DO VALOR TOTAL DO ALUGUEL, E ASSINATURA DO PRESENTE INSTRUMENTO.

        Parágrafo segundo. O valor referente à reserva/locação não será devolvido sob qualquer hipótese, mesmo em caso de cancelamento do contrato, podendo ser revertido para crédito em futura locação.

        4. DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO

        Cláusula 4ª: Havendo inadimplemento por parte do LOCATÁRIO quanto ao pagamento do aluguel, deverá incidir sobre o valor do presente instrumento, multa pecuniária de 2%, juros de mora de 1% ao mês e correção monetária. Em caso de cobrança judicial, devem ser acrescidas custas processuais e 20% de honorários advocatícios.

        DAS CONDIÇÕES GERAIS

        Cláusula 5ª. A(O) LOCATÁRIA(O) DEVERÁ CONFERIR OS BENS NO ATO DA RETIRADA. APÓS ESTE MOMENTO QUALQUER DANO SERÁ DE SUA RESPONSABILIDADE. CASO A(O) LOCATÁRIA(O) NÃO TENHA DISPONIBILIDADE DE TEMPO PARA REALIZAR A CONFERÊNCIA DAS PEÇAS NESTE MOMENTO, ASSUME A RESPONSABILIDADE POR QUALQUER DANO, FALTA OU AVARIA, RECONHECENDO A ENTREGA DOS ITENS EM PERFEITAS CONDIÇÕES.

        Cláusula 6ª. SE FOR CONSTATADO QUALQUER DANO, OU A FALTA DE QUALQUER BEM NO MOMENTO DA DEVOLUÇÃO, A(O) LOCATÁRIA(O) SE OBRIGA A PAGAR PELO OBJETO, IMEDIATAMENTE, O VALOR INFORMADO AO LADO DE CADA ITEM NA DESCRIÇÃO  E SOBRE REFERIDO VALOR, NÃO SE APLICA QUALQUER DESCONTO. Cláusula 7ª. PELA DEVOLUÇÃO APÓS O DIA E HORA CONTRATADOS, A(O) LOCATÁRIA(O) PAGARÁ POR DIA, O VALOR DE NOVA LOCAÇÃO.

        7. OS ITENS LOCADOS DEVERÃO SER DEVOLVIDOS NAS MESMAS EMBALAGENS E CONDIÇÕES EM QUE FORAM ENTREGUES.

        8. Se houver necessidade de nova higienização da peça antes do uso, É PROIBIDO o uso de palhas de aço, produtos corrosivos ou qualquer outro que possa causar danos na peça.

        9. A (o) LOCATÁRIA (o) autoriza, especificamente, a repostagem e/ou publicação de fotos em redes sociais, que contenham peças do acervo da LOCADORA, oriundas da presente locação.

        9. DO FORO Para dirimir quaisquer controvérsias oriundas do presente contrato, as partes elegem o foro da comarca de Santos/SP.
        
        `, fontSize: 8 },
        { text: `${city}, ${completeDate}`, fontSize: 8 }, '\n\n',
        {
            columns: [
                { text: [{ text: '________________________________________________________', fontSize: 8 }, '\n', { text: 'LOCATÁRIO', fontSize: 8 }], alignment: 'center' },
                { text: [{ text: '________________________________________________________', fontSize: 8 }, '\n', { text: 'LOCADORA', fontSize: 8 }], alignment: 'center' },
            ]
        }, '\n',
    ]

    var pdf = {
        pageMargins: 20,
        content: [
            {
                table: {
                    widths: [
                        "*",
                        100
                    ],
                    body: [
                        [
                            {
                                columns: [
                                    { width: 100, image: logo },
                                    { width: 10, text: ''},
                                    [
                                        {
                                            text: 'LOCADORA:',
                                            fontSize: 8,
                                            bold: true,
                                        },
                                        {
                                            text: `${fantasy_name}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `Razão Social: ${social_name}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `CPNJ: ${normalizedDoc}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `Telefone: ${phone}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `Email: ${email}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `Endereço: ${address}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `Bairro: ${neighborhood}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `Cidade: ${city}-${state}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `CEP: ${zip}`,
                                            fontSize: 8
                                        },
                                    ]
                                ]
                            },
                            [
                                {
                                    text:  "Nº DO PEDIDO",
                                    alignment: "center"
                                },
                                {
                                    text: _data.idn,
                                    alignment: "center",
                                    fontSize: 20
                                },
                            ]
                        ]
                    ]
                }
            },
            { canvas: [{ type: 'line', x1: 0, y1: 3, x2: 635 - 2 * 40, y2: 3, lineWidth: 2 }] }, '\n',
            { text: 'LOCATÁRIO: ', bold: true, alignment: 'center', fontSize: 12 },
            { canvas: [{ type: 'line', x1: 0, y1: 3, x2: 635 - 2 * 40, y2: 3, lineWidth: 2 }] }, '\n',

            { text: [{ text: 'Nome/Razão Social: ', bold: true }, { text: _data.customer.name }] },
            { text: [{ text: 'Endereço: ', bold: true }, { text: _data.customer.address }] },
            {
                columns: [
                    { text: [{ text: 'Bairro: ', bold: true }, _data.customer.neighborhood] },
                    { text: [{ text: 'Cidade: ', bold: true }, nullToEmpty(_data.customer.city) + '-' + nullToEmpty(_data.customer.state)] },
                    { text: [{ text: 'CEP: ', bold: true }, _data.customer.zip] },
                ]
            },
            {
                columns: [
                    { text: [{ text: 'CPF/CNPJ: ', bold: true }, normalizeDoc(_data.customer.doc)] },
                    { text: [{ text: 'Telefone: ', bold: true }, _data.customer.phone] },
                ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 635 - 2 * 40, y2: 5, lineWidth: 3 }] },
            '\n',
            {
                columns: [
                    { text: [{ text: 'Data de retirada: ', bold: true }, datePickupFormatted] },
                    { text: [{ text: 'Data de devolução: ', bold: true }, dateBackFormatted] },
                ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 635 - 2 * 40, y2: 5, lineWidth: 3 }] },
            '\n',
            { text: [{ text: 'LISTA DE ITEMS:', bold: true }] },
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
                margin: [0, 10, 0, 5]
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
    }

    const table = { widths: ['*', 30, 60, 70, 70] };
    table.body = [];
    table.body.push(
        [
            { text: '', bold: true }, 
            { text: 'Qnt.', bold: true }, 
            { text: 'Preço unit. (R$)', bold: true }, 
            { text: 'Total (R$)', bold: true }, 
            { text: 'Reposição (R$)', bold: true }
        ]
    );

    for (let i = 0; i < _data.order_items.length; i++) {
        let item = _data.order_items[i];
        table.body.push(
            [
                { text: (i + 1) + ' - ' + item.item.name + ' - ' + item.item.idn }, 
                { text: item.quantity, alignment: 'right' }, 
                { text: normalizeCurrencyDotToComma(item.value), alignment: 'right' }, 
                { text: normalizeCurrencyDotToComma(item.value * item.quantity), alignment: 'right' }, 
                { text: normalizeCurrencyDotToComma(item.value_repo), alignment: 'right' }
            ]
        );
    }
    

    table.body.push(
        [
            '',
            '',
            { text: 'Valor total:', bold: true },
            { text: totalValueFormatted, bold: true, alignment: 'right' },
            ''
        ]
    );

    if (_data.discount && _data.discount > 0 ) {
        table.body.push(
            [
                '', 
                '', 
                { text: 'Desconto:', bold: true }, 
                { text: normalizeCurrencyDotToComma(_data.discount), bold: true, alignment: 'right' }, 
                ''
            ]
        );

        table.body.push(
            [
                '',
                '',
                { text: 'Com desconto:', bold: true },
                { text: normalizeCurrencyDotToComma(_data.total), bold: true, alignment: 'right' },
                ''
            ]
        );
    }
    
    if (_data.deposit && _data.deposit > 0)
        table.body.push(
            [
                '',
                '',
                { text: 'Sinal:', bold: true },
                { text: normalizeCurrencyDotToComma(_data.deposit), bold: true, alignment: 'right' },
                ''
            ]
        );

    table.body.push(
        [
            '',
            '',
            { text: 'A pagar:', bold: true },
            { text: totalValueToPayFormatted, bold: true, alignment: 'right' },
            ''
        ]
    );

    pdf.content.push({ table });
    pdf.content.push({ text: '', pageBreak: 'after' });
    pdf.content.push(contractText);

    try {
        // console.log(JSON.stringify(pdf));
        // pdfMake.createPdf(pdf).open();
        pdfMake.createPdf(pdf).download('pedido.pdf');
    } catch (error) {
        alert('O navegador impediu a abertura do PDF');
    }
}

export default Receipt;
