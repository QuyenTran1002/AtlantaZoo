import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import "../../css/Login.css";
import SharedTableHead from '../../SharedTableHead.jsx';
import moment from "moment";
import SharedToolbar from '../../SharedToolbar.jsx';
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import {Link} from "react-router-dom";


let counter = 0;

// function createData(name, size, total_animals, water_feature) {
//     counter += 1;
//     return {id: counter, name, size, total_animals, water_feature};
// }

function createData(name, size, water_feature) {
    counter += 1;
    return {id: counter, name, size, water_feature};
}

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
    {id: 'name', numeric: false, disablePadding: true, label: 'Name'},
    {id: 'size', numeric: true, disablePadding: false, label: 'Size'},
    // {id: 'num_animals', numeric: true, disablePadding: false, label: 'NumAnimals'},
    {id: 'water_feature', numeric: false, disablePadding: true, label: 'Water Feature'}
];

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

/**
 * @todo: change api to fetch accordingly to search fields
 */
class ExhibitTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'name',
            selected: [],
            exhibits: [],
            page: 0,
            rowsPerPage: 5,
        };
        fetch(`http://localhost:5000/exhibits`, {

            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                return response.json();
            })
            .then(json => this.setState({
                exhibits: json.message.map(
                    exhibit => createData(
                        exhibit.exhibit_name,
                        exhibit.size,
                        // exhibit.total_animals,
                        exhibit.water_feature))
            }))
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({order, orderBy});
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({selected: state.exhibits.map(n => n.id)}));
            return;
        }
        this.setState({selected: []});
    };

    handleClick = (event, id) => {
        const {selected} = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({selected: newSelected});
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    handleRender = userContext => event => {
        // fetch(`http://localhost:5000/exhibits?email=${(userContext.email)}`, {

    };

    render() {
        const {classes} = this.props;
        const {exhibits, order, orderBy, selected, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, exhibits.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <SharedToolbar numSelected={selected.length} title={'List of exhibits'}/>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <SharedTableHead
                            data={rows}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={exhibits.length}
                        />
                        <TableBody>
                            {stableSort(exhibits, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    const isSelected = this.isSelected(n.id);
                                    return (
                                        <TableRow
                                            hover
                                            // onClick={event => this.handleClick(event, n.id)}
                                            // aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={n.id}
                                            // selected={isSelected}
                                        >
                                            <TableCell>
                                                {/*<Button variant="outlined" color="secondary" className={classes.button}*/}
                                                        {/*onClick={this.handleLogVisit(*/}
                                                            {/*{name: n.name,*/}
                                                                {/*time: n.time,*/}
                                                                {/*exhibit: n.exhibit})}>*/}
                                                    {/*Log Visit*/}
                                                {/*</Button>*/}

                                                {/*<TableCell padding="checkbox">*/}
                                                    {/*<Checkbox checked={isSelected} />*/}
                                                {/*</TableCell>*/}

                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                <Link to={`/exhibitdetail/${n.id}`} >
                                                {n.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{n.size}</TableCell>
                                            {/*<TableCell>{n.total_animals}</TableCell>*/}
                                            <TableCell>{n.water_feature}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{height: 49 * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={exhibits.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        )
    }
}

ExhibitTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExhibitTable);