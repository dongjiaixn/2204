export default class Problem {
    //构造方法  实例化类自动调用
    constructor() {
        //获取保存按钮绑定点击事件
        //this指向当前节点对象
        this.$('.save-data').addEventListener('click', this.savaData)
        //给tbody绑定带点击事件 ,利用事件委托将所有的子元素点击事件都委托给它
        //节点事件的回调方法的this指向的是当前节点对象
        //分发distribute
        //addEventListener是js动态绑定事件用event

        //bind是返回一个新的函数引用  改变其内部this指向
        this.$('.table tbody').addEventListener('click', this.distribute.bind(this))//this指向Problem的实例化对象
        this.getData();
        //给模态框的  确认删除按钮绑定事件
        this.$('.confirm-del').addEventListener('click', this.confirmDel.bind(this))

        //给修改的保存按钮绑定点击事件
        this.$('.modify-data').addEventListener('click',this.saveModify.bind(this))


    }
    /********tbody带你记得回调函数********/
    distribute(eve) {
        // console.log(eve);

        //获取事件源用target
        let tar = eve.target;
        //判断按钮是否有指定的类  确定当前点击的是什么按钮
        //删除的button上啊绑定btn-del
        //删除的button上  绑定btn-modify
        // console.log(tar.classList.contains('btn-del'));
        // console.log(tar);
        //判断是不是删除按钮 是调用删除的方法
        // console.log(this);  distribute指向tbody;
        if (tar.classList.contains('btn-del')) this.delData(tar);//调用删除的方法
        //判断点击的是否为修改按钮  是则调用修改的方法
        if (tar.classList.contains('btn-modify')) this.modifyData(tar);
    }
    /*
    1弹出修改模态框
    2将原有的数据显示在模态框中
    3将修改的数据的id隐藏到修改的模态框中
    4获取表单中数据 不为空发送给后台
    5刷新页面
     修改的方法*****/

    modifyData(target) {
        // console.log(target);
        //弹出修改的模态框
        $('#modifyModal').modal('show')
        //获取要修改的数据显示到模态框中
        //确定点击的是span还是button  找到对应的tr
        let trObj = '';
        if (target.nodeName == 'SPAN') {
            trObj = target.parentNode.parentNode.parentNode;

        } if (target.nodeName == 'BUTTON') {
            trObj = target.parentNode.parentNode;

        }
        // console.log(trObj);
        //获取所有的子节点 分别取出id idea title pos
        let chil=trObj.children;
        // console.log(chil);
        let id =chil[0].innerHTML;
        let title  =chil[3].innerHTML;
        let idea =chil[1].innerHTML;
        let pos =chil[2].innerHTML;
        
        // console.log(id,idea,pos,title);
        //将内容给放到修改表单中
        let form=this.$('#modifyModal form').elements;
        // console.log(form);
        //把值放入框里面   id不用修改 
        form.title.value=title;
        form.idea.value=idea;
        form.pos.value=pos;
        //将id设置为属性
        this.modifyId=id;     
    }

    saveModify(){
        // console.log(this.modifyId,222);
        //收集表单中的数据先获取表单
        // let form=this.$('#modifyModal form').elements;
        // console.log(form);
        //获取表单中的值
        // let title=form.title.value.trim();
        // let idea=form.idea.value.trim();
        // let pos=form.pos.value.trim();
        // console.log(title,idea,pos);


        //解构赋值方式 针对对象   能不能被解构可以查看prototype 里面的symbol的iterator是代表可迭代的  可以迭代就可以解构赋值
        let {title,idea,pos}=this.$('#modifyModal form').elements;
        // console.log(title,idea,pos);
        let titleVal=title.value.trim();
        let ideaVal=idea.value.trim();
        let posVal=pos.value.trim();
        // console.log(titleVal,ideaVal,posVal);

        //进行非空验证
        // if(!posVal || !ideaVal ||!titleVal) throw new Error('字段不可为空!')
        //结束代码   
        if(!posVal || !ideaVal ||!titleVal) return;

        //给后台发送数据进行修改
        axios.put('http://localhost:3000/problem/'+this.modifyId,{
            title:titleVal,//与json文件一致
            idea:ideaVal,
            pos:posVal
        }).then(res=>{
            // console.log(res);
            //请求成功刷新页面
            if(res.status==200){
                location.reload();
            }
          
        })
    }




    /*****保存数据的方法******/
    savaData() {
        // console.log(this);  //因为事件源  才可以获取出来

        //获取添加表单
        //input框有name就对应name值  没有就对应id
        let form = document.forms[0].elements;
        // console.log(form);
        //1获取表单中值
        //trim()  去除空格
        let title = form.title.value.trim();
        let pos = form.pos.value.trim();
        let idea = form.idea.value.trim();
        // console.log(title,pos,idea);
        //2判断表单中每一项是否有值  如果为空则提是
        if (!title || !pos || !idea) {
            // console.log(1111);  //只显示1111
            throw new Error('不能为空') //表单不能为空


        }

        //3将数据通过ajax发送给json-server服务器进行保存
        //json-server中post的请求是添加数据的
        axios.post('http://localhost:3000/problem', {
            title,
            pos,
            idea
        }).then(res => {
            //   console.log(res)
            //如果添加成功则刷新页面
            //201对应浏览器检查的201
            if (res.status == 201) {
                location.reload();   //刷新 模态框填写数据保存  自动刷新而模态框消失追加到表单中
            }
        })
    }

    /*******删除的方法****/
    delData(target) {
        //  console.log('我是删除');
        //将当前准备删除的节点保存到属性上
        this.target = target;
        // 弹出确认删除的模态框 通过js控制
        //$是jQuery方法  不是我们自己封装的 不加this
        $('#delModal').modal('show')



    }
    confirmDel() {
        //  console.log(this.target.nodeName);
        //获取id
        let id = 0;
        //确定点击的是span还是button
        if (this.target.nodeName == 'SPAN') {
            let trObj = this.target.parentNode.parentNode.parentNode;
            // console.log(trObj);
            //id是tr的第一个子节点
            id = trObj.firstElementChild.innerHTML
        } if (this.target.nodeName == 'BUTTON') {
            let trObj = this.target.parentNode.parentNode;
            // console.log(trObj);
            id = trObj.firstElementChild.innerHTML
        }
        // console.log(id);
        //将id发送给json-server服务器  删除对应的数据  刷新页面
        axios.delete('http://localhost:3000/problem/' + id).then(res => {
            // console.log(res);
            //判断状态为200删除成功
            if (res.status == 200) {
                location.reload();//刷新页面
            }
        })


        console.log('删除了');

    }

    /******获取数据******/
    getData() {
        // console.log('这是数据获取');
        //获取tbody 一个符合条件的  就返回单个节点对象 
        // let tbody=this.$('tbody');
        // console.log(tbody);
        //多个div返回节点集合
        // let div = this.$('div');
        // console.log(div);
        //1发送ajax请求  获取数据  引入axios
        axios.get('http://localhost:3000/problem').then(res => {
            // console.log(res);
            //2获取返回值中的data status
            let { data, status } = res;
            // console.log(data,status);
            //3当状态为200时表示请求成功
            if (status == 200) {
                // console.log(data);
                //4将获取的数据渲染到页面中  渲染到tbody中用遍历
                let html = '';
                data.forEach(ele => {
                    // console.log(ele);


                    //删除思路,1给行内绑定事件 使用静态方法
                    // <button type="button" class="btn btn-danger btn-xs" onclick="Problem.delData()"></button>

                    //静态方法属于类的
                    // static delData(){
                    //  console.log(111);
                    //}
                    //2使用事件委托  将删除修改操做的点击事件委托给tbody
                    html += `<tr>
                  <th scope="row">${ele.id}</th>
                  <td>${ele.title}</td>
                  <td>${ele.pos}</td>
                  <td>${ele.idea}</td>
                  
                  <td>
                  
                  <button type="button" class="btn btn-danger btn-xs btn-del ">
                  <span class="glyphicon glyphicon-trash btn-del" aria-hidden="true"></span>


                  </button><button type="button" class="btn btn-warning btn-xs btn-modify">
                  <span class="glyphicon glyphicon-refresh btn-modify" aria-hidden="true "></span></button></td>
              </tr>`

                });
                // console.log(html);
                // 5.将拼接的tr追加到页面中
                this.$('.table tbody').innerHTML = html;

            }
        })

    }


    /******获取节点方法******/
    $(ele) {
        let res = document.querySelectorAll(ele);
        //判断当前页面只有一个符合条件的  就返回单个节点对象 否则返回节点集合
        return res.length == 1 ? res[0] : res;
    }
}

new Problem;