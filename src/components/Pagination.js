import React, { useState, useEffect } from 'react';
import { Pagination as BSPagination }  from 'react-bootstrap'
import qs from 'query-string';

const Pagination = ({ page, changePage, history, totalCount, limit }) => {
    const [getPage, setPage] = useState(1);

    useEffect(
        () => {
            const _page = page ? page : 1;
            setPage(_page);
        },
        [page]
    )

    const totalPages = () => {
        return Math.ceil(totalCount/limit);
    }

    const hasNext = () => {
        return getPage + 1 <= totalPages()
    }

    const hasPrev = () => {
        return getPage - 1 > 0
    }

    const goToNext = () => {
        goToPage(getPage + 1);
    }

    const goToPrev = () => {
        goToPage(getPage - 1);
    }

    const goToPage = _page => {
        const parsedQuery = qs.parse(history.location.search);
        const newQueryString = qs.stringify({ ...parsedQuery, page: _page });
        history.push(`${history.location.pathname}?${newQueryString}`);
        changePage(_page);
    }

    return totalPages() > 1 ? (
        <BSPagination>
            {hasPrev() && (
                <>
                    <BSPagination.First 
                        onClick={ 
                            () => {
                                goToPage(1);
                            }
                        }
                    />
                    <BSPagination.Prev 
                        onClick={
                            () => {
                                goToPrev();
                            }
                        }
                    />
                </>
            )}
            {hasPrev() && (
                <BSPagination.Item
                    onClick={
                        () => {
                            goToPrev();
                        }
                    }
                >{getPage - 1}</BSPagination.Item>
            )}
            <BSPagination.Item active>{getPage}</BSPagination.Item>
            { hasNext() && (
                <BSPagination.Item
                    onClick={
                        () => {
                            goToNext();
                        }
                    }
                >{ getPage + 1}</BSPagination.Item>
            )}
            { hasNext() && (
                <BSPagination.Next 
                    onClick={
                        () => {
                            goToNext();
                        }
                    }
                />
            )}
            {getPage < totalPages() && (
                <BSPagination.Last 
                    onClick={
                        () => {
                            goToPage(totalPages());
                        }
                    }
                    key={totalPages()}
                />
            )}
            
        </BSPagination>
    ) : (<></>);
}

export default Pagination;
