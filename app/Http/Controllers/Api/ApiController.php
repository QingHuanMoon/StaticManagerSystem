<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;

class ApiController extends Controller
{
    protected $status;
    protected $msg;
    protected $code;
    protected $statusCode = Response::HTTP_OK;

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param mixed $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMsg()
    {
        return $this->msg;
    }

    /**
     * @param mixed $msg
     */
    public function setMsg($msg)
    {
        $this->msg = $msg;
        return $this;
    }

    /**
     * @return int
     */
    public function getStatusCode()
    {
        return $this->statusCode;
    }

    /**
     * @param int $statusCode
     */
    public function setStatusCode(int $statusCode)
    {
        $this->statusCode = $statusCode;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * @param mixed $code
     */
    public function setCode($code)
    {
        $this->code = $code;
        return $this;
    }

    public function storeSuccess($data, $msg = '數據新增成功!')
    {
        $this->responseSuccess()->setCode(201)->setStatusCode(201)->setMsg($msg);
        return $this->response($data);
    }

    public function storeFail($msg = '新增數據失敗')
    {
        $this->responseError()->setCode(601)->setStatusCode(601)->setMsg($msg);
        return $this->response();
    }

    public function deleteSuccess($data, $msg = '數據刪除成功')
    {
        $this->responseSuccess()->setCode(202)->setStatusCode(202)->setMsg($msg);
        return $this->response($data);
    }

    public function deleteFail($msg = '刪除數據失敗')
    {
        $this->responseError()->setCode(602)->setStatusCode(602)->setMsg($msg);
        return $this->response();
    }

    public function updateSuccess($data, $msg = '數據更新成功')
    {
        $this->responseSuccess()->setCode(203)->setStatusCode(203)->setMsg($msg);
        return $this->response($data);
    }

    public function updateFail($msg = '更新數據失敗')
    {
        $this->responseError()->setCode(603)->setStatusCode(603)->setMsg($msg);
        return $this->response();
    }

    public function findSuccess($data, $msg = '成功找到到您想要的數據')
    {
        $this->responseSuccess()->setCode(204)->setStatusCode(204)->setMsg($msg);
        return $this->response($data);
    }

    public function findFail($msg = '查找不到對應的數據')
    {
        $this->responseError()->setCode(604)->setStatusCode(604)->setMsg($msg);
        return $this->response();
    }

    private function responseSuccess()
    {
        $this->setStatus('success');
        return $this;
    }

    private function responseError()
    {
        $this->setStatus('error');
        return $this;
    }

    private function response($data = [])
    {
        if($this->getStatus() === 'success') {
            $this->returnSuccessData($data);
        } else {
            $this->returnErrorData($data);
        }
    }

    private function returnSuccessData($data)
    {
        return response()->json([
            'status' => $this->getStatus(),
            'code' => $this->getCode(),
            'data' => $data,
            'msg' => $this->getMsg()
        ]);
    }

    private function returnErrorData($data)
    {
        return response()->json([
            'status' => $this->getStatus(),
            'code' => $this->getCode(),
            'error' => [
                'msg' => $this->getMsg(),
                'data' => $data
            ]
        ]);
    }
}
