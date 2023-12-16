import { useState, useCallback, ChangeEvent, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Badge from '../badge/Badge';

interface Payout {
  /** Time of payout */
  dateAndTime: string;
  /** Payout status e.g. "Pending"*/
  status: string;
  /** Monetary value */
  value: string;
  /** Username paid out to */
  username: string;
  data?: Payout[]
}

interface PayoutsResponse {
  /** Metadata for results, can be set in query params */
  metadata: {
    page: number;
    limit: number;
    totalCount: number;
  };
  data: Payout[];
}

const PayoutHeading = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 1rem;
  gap: 16px;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 3;
  font-weight: 800;
  color: #000;
`;

const Tag = styled.span`
  width: 16px;
  height: 32px;
  border-radius: 4px;
  background: #999DFF;
`

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 600px;
  width: 100vw;
  background-color: #fff;
  overflow-y: auto;
  color: #6F767E;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 80%;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 171.429% */
  letter-spacing: -0.14px;
  margin-top: 50px;
  position: relative;
`;

const TableHeader = styled.thead`
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  letter-spacing: -0.12px;
  color: #6F767E;
`;
const HeadingTitle = styled.h2`
  margin: 0;
`;

const HeadingSearch = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const SearchInput = styled.input`
    padding: 0.5rem;
    padding-left: 1rem;
    border-bottom-width: 2px;
    border-color: rgb(133, 78, 246);
    border-left-width: 2px;
    border-right-width: 2px;
    border-style: solid;
    border-top-width: 2px;
    background-color: rgba(131, 78, 245, 0);
    opacity: 1;
    border-radius: 12px;
`;

const TableRow = styled.tr`
  height: 48px;
  padding: 24px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  &:nth-child(odd) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 8px;
  text-align: left; 
  &:nth-child(2) {
    width: 413px;
  }
`;

const LoadMoreButton = styled.button`
  padding: 1rem;
  margin-top: 1rem;
  border-bottom-width: 2px;
  border-color: rgb(133, 78, 246);
  border-left-width: 2px;
  border-right-width: 2px;
  border-style: solid;
  border-top-width: 2px;
  background-color: rgba(131, 78, 245, 0);
  opacity: 1;
  border-radius: 12px;
  color: #6F767E;
`;


/**
 * Payouts - displays payouts in a table with infinite scroll and search
 * */
const Payouts = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const formatDateTime = (dateTimeString: string) => {
    const formattedDateTime = new Date(dateTimeString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    return formattedDateTime;
  };

  const fetchPayouts = useCallback(async (query: string | null, pageNumber: number) => {
    const isSearch = query && query.length > 0;
    const url = isSearch
      ? `https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/search?query=${query}&page=${pageNumber}&limit=10`
      : `https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts?page=${pageNumber}&limit=10`;

    try {
      setLoading(true);

      const response = await fetch(url);
      const data: PayoutsResponse = await response.json();

      setPayouts(prevPayouts => (isSearch ? data.data || [] : [...prevPayouts, ...(data.data || [])]));
      setPage(pageNumber + 1);
      setHasMoreData(isSearch ? (data.data?.length || 0) > 0 : (data.data?.length || 0) > 0 || false);
    } catch (error) {
      console.error('Error fetching payouts:', error);
    } finally {
      setLoading(false);
    }
  }, []);


  const handleLoadMore = () => {
    if (!loading && hasMoreData) {
      fetchPayouts(searchTerm, page);
    }
  };

  const handleSearch = () => {
    console.log('blurred')
    setPage(1);
    fetchPayouts(searchTerm, 1);
  };

  useEffect(() => {
    fetchPayouts(searchTerm, page);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container = tableContainerRef.current;
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
          handleLoadMore();
        }
      }
    };

    tableContainerRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      tableContainerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [handleLoadMore]);

  return (
    <TableContainer ref={tableContainerRef}>
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: '#fff' }}>
            <TableCell colSpan={2}>
              <PayoutHeading>
                <Tag />
                <HeadingTitle>Payout History</HeadingTitle>
              </PayoutHeading>
            </TableCell>
            <TableCell colSpan={2}>
              <HeadingSearch>
                <SearchInput
                  type="text"
                  placeholder="Search by User Name"
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  onInput={handleSearch}
                />
              </HeadingSearch>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Date &amp; Time</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {payouts.map((payout: any) => (
            <TableRow key={payout.id}>
              <TableCell>{formatDateTime(payout.dateAndTime)}</TableCell>
              <TableCell>{payout.username}</TableCell>
              <TableCell>
                <Badge status={payout.status} />
              </TableCell>
              <TableCell>{payout.value}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      {hasMoreData && (
        <LoadMoreButton onClick={handleLoadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </LoadMoreButton>
      )}
    </TableContainer>
  );

};

export default Payouts;
