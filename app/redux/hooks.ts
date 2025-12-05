// eslint-disable-next-line @typescript-eslint/no-restricted-imports -- defining typed hooks requires raw imports here
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
