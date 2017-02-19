<?php

	$pathinfo = $_SERVER['PATH_INFO'];

	// 假如pathinfo不为空
	if($pathinfo){
		// 将$pathinfo拆成数组，判断数组长度
		// 来确定$path的类型
		// explode：将字符串拆成数组，类似js中的split()
		// substr：截取字符串，类似js中substr()
		$pathinfo = explode('/', substr($pathinfo, 1));
		// count php系统函数，用于计算数组长度
		if(count($pathinfo)==1){
			// 长度等于1要取 views/index目录下的内容
			$path = 'index/' . $pathinfo[0];
		} else {
			$path = $pathinfo[0] . '/' . $pathinfo[1];
		}
	} else {
		$path = 'index/index';
	}

	// 拼凑真实路径，返回给浏览器
	include './views/' . $path . '.html';	