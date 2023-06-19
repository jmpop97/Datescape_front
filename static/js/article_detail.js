console.log("js연결!")

token = localStorage.getItem("access")
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("id");
console.log(urlParams)
console.log(articleId)
/*게시글 정보 가져오기 */
window.onload = async () => {
    const response = await fetch(`${back_base_url}/articles/${articleId}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET",
    });
    let data = await response.json()
    let add_html = document.querySelector('#add_html')
    let articleHtml = ``

    console.log(data)
    console.log(response)


    if (response.status == 200) {
        console.log(data)
        articleHtml = `
            <div class="detail_box">
                <div class="title_box">
                    <div class="title_left">
                        <p class="user">
                            작성자: ${data.user}
                        </p><!-- e:user -->
                        <p class="title">
                            제목 : ${data.title}
                        </p><!-- e:title -->
                    </div><!-- e:title_left -->
                    <div class="title_right">
                        <a href="${front_base_url}/templates/article_update.html?id=${articleId}&/" button class="btn btn-outline-secondary" type="button" id="article-fix">수정</a>
                        <a button class="btn btn-outline-secondary" onclick="articleDelete()" type="button">삭제</a>
                        <a href="${front_base_url}/templates/article_list.html" class="btn btn-outline-secondary" type="button">목록</a>
                    </div><!-- e:title_right -->
                </div><!-- e:title_box -->
                <div id="image_box">

                </div><!-- e:image_box -->
                <div class="content_box">
                    ${data.content}
                </div><!-- e:content_box -->
                <div class="map_box">
                    <div class="map_content">
                    주소 : ${data.road_address}
                        <div id="map" style="width:500px;height:400px;"></div>
                    </div>
                </div><!-- e:map_box -->
                <div class="comment_box">
                    댓글
                </div><!-- e:comment_box -->
            </div><!-- e:detail_box -->
                `
    }
    add_html.innerHTML = articleHtml
    //다중이미지 출력부분
    let image_box = document.querySelector('#image_box')
    let imageHtml = ``
    for (let i = 0; i < await data.image.length; i++) {
        console.log(data.image[i])
        imageHtml += `
        <img src="${image_url}/${data.image[i]["image"]}" alt="자동추가되게하자~">
        `
        // tag_add += '#' + data.results[i].tags[a].tag + ' '
    }
    image_box.innerHTML = imageHtml
    loadArticlePosition(data)
}
async function articleDelete() {
    if (confirm("삭제하시겠습니까?")) {
        const response = await fetch(
            `${back_base_url}/articles/${articleId}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: "DELETE",
            }
        );
        if (response.status == 204) {
            alert("삭제되었습니다.");
            window.opener.location.reload()
            window.close()
        } else {
            alert("권한이 없습니다!");
        }
    } else {
        // 취소 버튼을 눌렀을 경우
        return false;
    }
}
/*지도에 좌표 찍기 */
async function loadArticlePosition(position) {
    // 내 위치 표시
    var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    var options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(position.coordinate_y, position.coordinate_x), //지도의 중심좌표.(위도,경도)
        level: 3 //지도의 레벨(확대, 축소 정도)
    };
    var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

    // 마커 위치 설정
    var articlePosition = new kakao.maps.LatLng(position.coordinate_y, position.coordinate_x);
    // 마커 생성
    var myMarker = new kakao.maps.Marker({
        position: articlePosition
    });
    // 마커가 지도 위에 표시되도록 설정
    myMarker.setMap(map);
}

/*게시글신고*/
article_report_button = document.getElementById("article-report-button")
article_report_button.setAttribute('onclick', `Report_button(2,${articleId})`)
/*게시글수정*/
