import {useCallback, useEffect, useState} from "react";
import {fetchData, removeData, sendData, UserData} from "../utilities/services";

export const usePost = (url: string) => {
  const [status, setStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = async (payload: UserData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await sendData(url, payload);
      setStatus(result.success);
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) {
        setError(err.message);
      } else setError("An Unknown Error Occurred");
    } finally {
      setLoading(false);
    }
  };
  return {status, loading, error, post};
};

interface FetchDataResult<T> {
  data: T | [];
  loading: boolean;
  error: string | null;
}

export const useGet = <T>(url: string): FetchDataResult<T> => {
  const [data, setData] = useState<T | []>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchData(url);
      setData(result);
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) {
        setError(err.message);
      } else setError("An Unknown Error Occurred");
    } finally {
      setLoading(false);
    }
  }, [url]);
  useEffect(() => {
    get();
  }, [get]);
  return {data, loading, error};
};

export const useDelete = () => {
  const [status, setStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await removeData(url);
      setStatus(result.message);
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) {
        setError(err.message);
      } else setError("An Unknown Error Occurred");
    } finally {
      setLoading(false);
    }
  };
  return {status, loading, error, remove};
};
