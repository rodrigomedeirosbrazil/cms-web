import React, { useState, useEffect } from 'react';
import { Pagination as BSPagination }  from 'react-bootstrap'

const Pagination = ({ page, history, totalCount, limit }) => {
    const [getPage, setPage] = useState(1);

    useEffect(
        () => {
            const _page = page ? page : 1;
            setPage(_page);
        },
        [page]
    )

    const totalgetPages = () => {
        return Math.ceil(totalCount/limit);
    }

    const hasNext = () => {
        return getPage + 1 <= totalgetPages()
    }

    const hasPrev = () => {
        return getPage - 1 > 0
    }

    const getLocation = () => {
        const location = history.location.pathname;
        const lastSlash = location.lastIndexOf('/');
        const path = location.substring(0,lastSlash+1);
        if (path === '/') return location+path;
        return path;
    }

    return (
        <BSPagination>
            {hasPrev() && (
                <>
                    <BSPagination.First 
                        onClick={ 
                            () => {
                                history.push(getLocation()+1);
                            }
                        }
                    />
                    <BSPagination.Prev 
                        onClick={
                            () => {
                                history.push(getLocation() + (getPage - 1));
                            }
                        }
                    />
                </>
            )}
            {hasPrev() && (
                <BSPagination.Item
                    onClick={
                        () => {
                            history.push(getLocation() + (getPage - 1));
                        }
                    }
                >{getPage - 1}</BSPagination.Item>
            )}
            <BSPagination.Item active>{getPage}</BSPagination.Item>
            { hasNext() && (
                <BSPagination.Item
                    onClick={
                        () => {
                            history.push(getLocation() + (getPage + 1));
                        }
                    }
                >{ getPage + 1}</BSPagination.Item>
            )}
            { hasNext() && (
                <BSPagination.Next 
                    onClick={
                        () => {
                            history.push(getLocation() + (getPage + 1));
                        }
                    }
                />
            )}
            {getPage < totalgetPages() && (
                <BSPagination.Last 
                    onClick={
                        () => {
                            history.push(getLocation() + totalgetPages());
                        }
                    }
                    key={totalgetPages()}
                />
            )}
            
        </BSPagination>
    );
}

export default Pagination;
