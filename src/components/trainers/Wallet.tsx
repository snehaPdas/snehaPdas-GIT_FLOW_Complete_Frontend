import React, { useState,useEffect } from 'react';
import { IWallet } from "../../types/trainer";
import trainerAxiosInstance from '../../../axios/trainerAxiosInstance';
import toast, { Toaster } from "react-hot-toast";


import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Box,
  TableFooter,
  TablePagination
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

function Wallet() {
    const [walletData, setWalletData] = useState<IWallet | null>(null);
    const { trainerInfo } = useSelector((state: RootState) => state.trainer);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [withdrawMoney, setWithdrawMoney] = useState<{ amount: string | null }>({ amount: null });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    



    useEffect(() => {
        const fetchWalletData = async () => {
          const response = await trainerAxiosInstance.get(`/api/trainer/wallet-data/${trainerInfo.id}`);
          setWalletData(response.data);
        };
        fetchWalletData();
      }, [trainerInfo.id]);
      const handleWithdrawButton = () => {
        setIsModalOpen(true);
      };const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
      
        const amount = withdrawMoney.amount ?? "";
        if (!amount || parseFloat(amount) <= 0) {
          toast("Please enter a valid amount to withdraw.");
          return;
        }
      
        try {
          const response = await trainerAxiosInstance.post(`/api/trainer/withdraw/${trainerInfo.id}`, {
            amount: parseFloat(amount),
          });
      
          if (response.status === 200) {
            toast.success("Money withdrawal successful.");
      
            setWalletData((prev) => {
              if (!prev) return null;
      
              const newTransaction = {
                transactionId: `txn_${Date.now()}`,
                amount: parseFloat(amount),
                transactionType: "debit",
                date: new Date(),
              };
      
              return {
                ...prev,
                balance: prev.balance - parseFloat(amount),
                transactions: [...prev.transactions, newTransaction],
              };
            });
      
            setIsModalOpen(false);
            setWithdrawMoney({ amount: null });
          } else {
            alert("Withdrawal request failed. Please try again.");
          }
        } catch (error) {
          alert("An error occurred. Please try again later.");
        }
      };
      

      const toggleModal = () => {
        setWithdrawMoney({amount: null})
        setIsModalOpen(!isModalOpen);
      };
      const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      };
      
      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
      const paginatedTransactions = walletData?.transactions.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
            

      return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
          {/* Wallet Balance Card */}
          <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Wallet Balance
              </Typography>
              <Typography variant="h3" align="center" color="success.main" gutterBottom>
                Rs.{walletData?.balance}
              </Typography>
              <Button
                variant="contained"
                onClick={handleWithdrawButton}
                color="secondary"
                sx={{ mt: 2 }}
              >
                Withdraw Money
              </Button>
            </CardContent>
          </Card>
      
          {/* Transaction History */}
          <Typography variant="h6" align="center" gutterBottom>
            Transaction History
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.200' }}>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions && paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((tx) => (
                    <TableRow key={tx.transactionId}>
                      <TableCell>{tx.transactionId}</TableCell>
                      <TableCell
                        sx={{ color: tx.transactionType === 'credit' ? 'success.main' : 'error.main' }}
                      >
                        {tx.transactionType.charAt(0).toUpperCase() + tx.transactionType.slice(1)}
                      </TableCell>
                      <TableCell align="right">Rs.{tx.amount.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        {new Date(tx.date??Date.now()).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={walletData?.transactions.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
      
          {/* Withdrawal Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px]">
                <h2 className="text-xl font-semibold mb-4">Withdraw Money</h2>
                <form onSubmit={handleWithdraw}>
                  <input
                    type="number"
                    value={withdrawMoney.amount ?? ''}
                    onChange={(e) => setWithdrawMoney({ amount: e.target.value })}
                    placeholder="Enter amount"
                    className="border rounded-lg p-2 w-full mb-4"
                    required
                  />
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                      onClick={toggleModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Withdraw
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Box>
      );
      
}

export default Wallet;
