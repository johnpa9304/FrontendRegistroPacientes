import React, { Component } from 'react'

class Pagination extends Component {

    render() {
        const { registrosPerPage, totalRegistros, paginate, nextPage, prevPage, currentPage } = this.props;

        var botonActivoP = false;
        var botonActivoN = false;

        const pageNumbers = [];

        for (let i = 1; i <= Math.ceil(totalRegistros / registrosPerPage); i++) {
            pageNumbers.push(i);
        }

        if(!(Math.ceil(totalRegistros / registrosPerPage)===currentPage)){
            botonActivoN = true;
        }else{
            botonActivoN = false;
        }

        if(!(1===currentPage)){
            botonActivoP = true;
        }else{
            botonActivoP = false;
        }

        return (
            <nav>
                <ul className="pagination justify-content-end">
                    <li className="page-item">
                        <button className="page-link" onClick={() => prevPage()} disabled={!botonActivoP}>Previous</button>
                    </li>
                    {pageNumbers.map(num => (
                        <li className="page-item" key={num}>
                            <button onClick={() => paginate(num)} className="page-link">{num}</button>
                        </li>
                    ))}
                    <li className="page-item">
                        <button className="page-link" onClick={() => nextPage()} disabled={!botonActivoN}>Next</button>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Pagination;