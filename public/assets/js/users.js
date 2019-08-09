// 主要是用于操作用户的 
var userArr = new Array();
// 将用户列表展示出来 
$.ajax({
    type:'get',
    url:'/users',
    success:function(res){
        userArr = res;
        render(userArr);
    }
})

// 用于调用template方法 
function render(arr){   
   var str =  template('userTpl',{
        list:arr
    });
    // console.log(str);
    $('tbody').html(str);
}

// 添加用户功能 
$('#userAdd').on('click',function(){
    // console.log($('#userForm').serialize());
    $.ajax({
        url:'/users',
        type:'post',
        data:$('#userForm').serialize(),
        success:function(res){
            userArr.push(res);
            render(userArr);
        }
    })
});


// 用户操作头像的时候
$('#avatar').on('change' , function(){
    var formData =  new FormData();
    formData.append('avatar' , this.files[0]);

    $.ajax({
        type: 'post',
        url:'/upload',
        data:formData,
        //不要解析参数
        processData: false,
        contentType: false,
        success:function(res){
            // 实现头像预览
            $('#preview').attr('src' ,  res[0].avatar);
            //实现图片地址展示
            $('#hiddenAvatar').val(res[0].avatar);
        }
    })
});


// 获取ID
var userID;
// 编辑功能
$('#userBox').on('click' , '.edit' , function(){
    userID = $(this).parent().attr('data-id');
    // 获取绑定的事件的祖元素
    var  trObj = $(this).parents('tr');
    //将对应的内容写到左边的输入框里面
    $('#email').val(trObj.children().eq(2).text());
    $('#nickName').val(trObj.children().eq(3).text());

    //激活按钮选择
    var  status = trObj.children().eq(4).text();
    if(status == "激活"){
        $('#jh').prop('checked' , true);
    }else {
        $('#wjh').prop('checked' , true);
    }

    //管理员按钮选择
    var role = trObj.children().eq(5).text();
    if(role == "超级管理员"){
        $('#admin').prop('checked' , true);
    }else{
        $('#normal').prop('checked' , true);
    }

    // 修改图片
    // 获取地址
    var  imgSrc  = trObj.children(1).children('img').attr('src');
    // 将图片地址写到隐藏域中
    $('#hiddenAvatar').val('imgSrc');
    // 如果imgSrc有值则渲染  没有则使用原始图片
    if(imgSrc){
        $('#preview').attr('src' , imgSrc);
    } else{
        $('#preview').attr('src' , "../assets/img/default.png");
    }

    //修改图片上文字
    $('#userForm  h2').text("修改用户")

    $('#userAdd').hide();
    $('#userEdit').show();    

})

//提交修改用户
$('#userEdit').on('click' , function(){
    $.ajax({
        type:'put',
        url:'/users/'+userID,
        data:$('#userForm').serialize(),
        success:function(res){
            var index = userArr.findIndex(item=>item._id == userID);
            userArr[index] = res;
            render(userArr);
        }
    });

    // 重置表单项
    $('#userForm  h2').text("添加新用户")
    $('#hiddenAvatar').val('');
    $('#preview').attr('src' , "../assets/img/default.png");
    $('#userAdd').show();
    $('#userEdit').hide();    
    $('#email').val("");
    $('#nickName').val("");

})
