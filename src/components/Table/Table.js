import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './Table.module.sass';

const Table = ({
  data,
  columns,
  metadata,
  onHeaderClick,
  sortKey,
  sortAsc,
  onPageSelect,
  onRowClick,
  hideMetaData,
  isLoading,
  className
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const { limit, offset, total } = metadata;
  const currentPage = offset / limit + 1;
  const totalPages = Math.ceil(total / limit);
  const paginationNumbers = Array(5)
    .fill(0)
    .map((x, i) => (currentPage < 4 ? i + 1 : i + (currentPage - 2)));

  const setActiveRow = (index, row) => {
    setActiveIndex(index);
    onRowClick(row);
  };

  const clearActiveIndex = () => {
    typeof activeIndex === 'number' && setActiveIndex(null);
  };

  return (
    <div className={cx(styles.tableData, className)}>
      <table className={styles.table} onMouseOver={clearActiveIndex}>
        <thead>
          <tr>
            {columns.map(({ header, key, preventSort }, index) => (
              <th key={index}>
                <span
                  className={cx({
                    [styles.sortable]: onHeaderClick && !preventSort,
                    [styles.sortAsc]: sortKey === key && sortAsc,
                    [styles.sortDes]: sortKey === key && !sortAsc
                  })}
                  onClick={() =>
                    !preventSort && onHeaderClick && onHeaderClick(key)
                  }
                >
                  {header}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={cx('', {
                [styles.clickable]: onRowClick,
                [styles.activeRow]: index === activeIndex
              })}
              onClick={() => onRowClick && setActiveRow(index, row)}
            >
              {columns.map(({ render, key }, index) => (
                <td key={index}>{render ? render(row) : row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!hideMetaData && (
        <nav className={styles.tableNav}>
          <span>
            {limit && (
              <>
                Showing {total === 0 ? 0 : offset + 1} to{' '}
                {Math.min(offset + limit, total)} of {total} records
              </>
            )}
          </span>
          <ul className={styles.pagination}>
            <li
              onClick={() => currentPage !== 1 && onPageSelect(currentPage - 1)}
              className={cx({
                [styles.unavailablePage]: currentPage === 1
              })}
            >
              {'<'}
            </li>
            {limit &&
              paginationNumbers.map((number, index) => (
                <li
                  key={index}
                  onClick={() =>
                    number <= totalPages &&
                    number !== currentPage &&
                    onPageSelect(number)
                  }
                  className={cx({
                    [styles.unavailablePage]: number > totalPages,
                    [styles.currentPage]: number === currentPage
                  })}
                >
                  {number}
                </li>
              ))}
            <li
              onClick={() =>
                currentPage !== totalPages && onPageSelect(currentPage + 1)
              }
              className={cx({
                [styles.unavailablePage]: currentPage === totalPages
              })}
            >
              {'>'}
            </li>
          </ul>
        </nav>
      )}
      {isLoading && <div className={styles.loadingMask} />}
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  metadata: PropTypes.object,
  sortKey: PropTypes.string,
  sortAsc: PropTypes.bool,
  onHeaderClick: PropTypes.func,
  onPageSelect: PropTypes.func,
  onRowClick: PropTypes.func,
  hideMetaData: PropTypes.bool,
  isLoading: PropTypes.bool,
  className: PropTypes.string
};

Table.defaultProps = {
  metadata: {
    limit: 0,
    offset: 0,
    total: 0
  }
};

export default Table;
