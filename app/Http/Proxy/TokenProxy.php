<?php
/**
 * Created by PhpStorm.
 * User: lc-ms-tmp
 * Date: 2018/5/24
 * Time: 下午4:39
 */

namespace App\Http\Proxy;



use App\Http\Helper\Helper;

class TokenProxy
{
    protected $http;
    public function __construct(\GuzzleHttp\Client $http)
    {
        $this->http = $http;
    }

    public function proxy($grandType, array $data = [])
    {
        $data = array_merge($data, [
            'client_id'=> env('PASSPORT_CLIENT_ID'),
            'client_secret'=> env('PASSPORT_CLIENT_SECRET'),
            'grant_type'=> $grandType,
        ]);
        dd($data);
        $response = $this->http->post(Helper::getHost() . '/oauth/token',[
            'form_params' => $data
        ]);
        $token = json_decode((string) $response->getBody(), true);

        return response()->json([
            'token' => $token['access_token'],
            'expires_in' => $token['expires_in'],
            'status'     => '200'
        ])->cookie('refreshToken', $token['refresh_token'], 14400, null, null, false, true);
    }

    public function login() {
        return $this->proxy('password',[
            'username' => request('email'),
            'password' => request('password'),
            'scope'    => ''
        ]);
    }

    public function logout()
    {
        $user = auth()->guard('api')->user();
        if(is_null($user)) {
            app('cookie')->queue(app('cookie')->forget('refreshToken'));
            return response()->json([
                'msg' => '退出登錄成功',
                'status' => 204
            ]);
        }
        $data = ['isOnline' => 0];
        $user->update($data);

        $accessToken = $user->token();

        app('db')->table('oauth_refresh_tokens')
            ->where('access_token_id', $accessToken->id)
            ->update([
                'revoked' => true
            ]);

        app('cookie')->queue(app('cookie')->forget('refreshToken'));

        $accessToken->revoke();

        return response()->json([
            'msg' => '退出登錄成功',
            'status' => 204
        ]);


    }

    public function refresh()
    {
        $refresh_token = request()->cookie('refreshToken');

        return $this->proxy('refresh_token', [
           'refresh_token' => $refresh_token
        ]);
    }
}
