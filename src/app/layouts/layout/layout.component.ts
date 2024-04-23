import { Component, HostListener, OnInit } from '@angular/core';
import { DataStateLeftMenuService } from '@shared/services/changeLeftMenu.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize() {
    let widthOutput = window.innerWidth;
    let toggle = document.getElementById("ftms-footer-toggle"),
      nav = document.getElementById("ftms-nav-bar");
    let navName = document.querySelectorAll(".ftms-nav-name");
    let navLink = document.querySelectorAll(".ftms-nav-link");
    let headerText = document.getElementById("ftms-header-text");
    let navLinkGroup = document.querySelectorAll(".ftms-nav-link-group");
    let toggle1 = document.getElementById("ftms-footer-toggle1");
    let appName = document.getElementById("ftms-app-name-menu");
    let center = document.getElementById("ftms-center");
    let persionSupport = document.getElementById("ftms-contact");
    let borderLeft = document.getElementById("ftms-border-left");
    let appNamehead = document.getElementById("ftms-app-name");
    let borderAppName = document.getElementById("ftms-boder-app-name");
    if (widthOutput <= 1150) {
      persionSupport.classList.add("ftms-hide-item")
    } else {
      persionSupport.classList.remove("ftms-hide-item")
    }
    if (widthOutput <= 525) {
      center.classList.add("ftms-hide-item")
      borderLeft.classList.add("ftms-hide-item")
    } else {
      center.classList.remove("ftms-hide-item")
      borderLeft.classList.remove("ftms-hide-item")
    }
    if (widthOutput <= 768) {
      //mini
      this.dataService.changeState(false);
      nav.classList.remove("show-leftMenu");
      // change icon
      toggle.classList.add("fa-angle-double-right");
      toggle.classList.remove("fa-angle-double-left");
      toggle1.classList.add("fa-angle-double-right");
      toggle1.classList.remove("fa-angle-double-left");
      headerText.classList.add("ftms-hide-item");
      toggle.classList.add("ftms-padding-icon-callap");
      // toggle.classList.add("ftms-padding-icon-callap");
      //tắt accondion menu
      //ẩn tên menu
      appName.classList.add("ftms-margin-heade-nav");
      appNamehead.classList.add("ftms-hide-item");
      borderAppName.classList.add("ftms-hide-item");

      let $el = document.querySelectorAll(".ftms-submenu");
      let $elLi = document.querySelectorAll(".ftms-nav-link-group");
      $el.forEach(e => {
        let ele = e as HTMLElement;
        ele.style.display = 'none';
      })
      $elLi.forEach((l) => l.classList.remove("ftms-open"));
      //ẩn hiện tên nav
      navName.forEach((l) => l.classList.add("ftms-hide-item"));
      //cho padding về 0 
      navLink.forEach((l) => l.classList.add("ftms-show-padding0"));
      //hover link tiem
      navLinkGroup.forEach((l) => l.classList.add("ftms-nav-link-item"));
    } else {
      //full
      this.dataService.changeState(true);
      nav.classList.add("show-leftMenu");
      toggle.classList.remove("fa-angle-double-right");
      toggle.classList.add("fa-angle-double-left");
      toggle1.classList.remove("fa-angle-double-right");
      toggle1.classList.add("fa-angle-double-left");
      headerText.classList.remove("ftms-hide-item");
      toggle.classList.remove("ftms-padding-icon-callap");
      // toggle.classList.remove("ftms-padding-icon-callap");
      appName.classList.remove("ftms-margin-heade-nav");
      appNamehead.classList.add("ftms-hide-item");
      borderAppName.classList.add("ftms-hide-item");
      //ẩn hiện tên nav
      navName.forEach((l) => l.classList.remove("ftms-hide-item"));
      //cho padding về 0 
      navLink.forEach((l) => l.classList.remove("ftms-show-padding0"));
      //hover link tiem
      navLinkGroup.forEach((l) => l.classList.remove("ftms-nav-link-item"));
      //kiểm tra xem menu cha có active không nếu đang active khi show ra thì show luôn menu
      if (nav.classList.contains("show-leftMenu")) {
        //kiểm tra menu xem cái nào đang active không
        let itemActiveMenu = document.querySelectorAll(".ftms-nav-menu-active")[0];
        if (itemActiveMenu) {
          //kiểm tra xem menu có menu con không nếu có thì add class ftms-open
          itemActiveMenu.parentNode.childNodes.forEach(el => {
            let ele = el as HTMLElement;
            if (ele.classList) {
              if (ele.classList.contains("ftms-submenu")) {
                let parent = ele.parentNode as HTMLElement;
                parent.classList.add("ftms-open");
                ele.style.display = 'block';
              }
            }
          })
        }
      }
    }
  }
  constructor(
    private dataService: DataStateLeftMenuService
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.loadder(false)
  }

  private loadder(minisibar) {
    //khi load chcekc luôn
    let widthOutput = window.innerWidth;
    let toggle = document.getElementById("ftms-footer-toggle"),
      nav = document.getElementById("ftms-nav-bar");
    let navName = document.querySelectorAll(".ftms-nav-name");
    let navLink = document.querySelectorAll(".ftms-nav-link");
    let headerText = document.getElementById("ftms-header-text");
    let navLinkGroup = document.querySelectorAll(".ftms-nav-link-group");
    let toggle1 = document.getElementById("ftms-footer-toggle1");
    let appName = document.getElementById("ftms-app-name-menu");
    let center = document.getElementById("ftms-center");
    let persionSupport = document.getElementById("ftms-contact");
    let borderLeft = document.getElementById("ftms-border-left");
    let appNamehead = document.getElementById("ftms-app-name");
    let borderAppName = document.getElementById("ftms-boder-app-name");
    if (widthOutput <= 1150) {
      persionSupport.classList.add("ftms-hide-item")
    } else {
      persionSupport.classList.remove("ftms-hide-item")
    }
    if (widthOutput <= 525) {
      center.classList.add("ftms-hide-item")
      borderLeft.classList.add("ftms-hide-item")
    } else {
      center.classList.remove("ftms-hide-item")
      borderLeft.classList.remove("ftms-hide-item")
    }
    //kiểm tra xem setting để là gì nếu là true thì hiển thị mini false hiển thị full
    if (minisibar) {
      //cho trạng thái về false nếu là mini
      this.dataService.changeState(false);
      nav.classList.remove("show-leftMenu");
      // change icon
      toggle.classList.add("fa-angle-double-right");
      toggle.classList.remove("fa-angle-double-left");
      toggle1.classList.add("fa-angle-double-right");
      toggle1.classList.remove("fa-angle-double-left");
      headerText.classList.add("ftms-hide-item");
      toggle.classList.add("ftms-padding-icon-callap");
      // toggle.classList.add("ftms-padding-icon-callap");
      //tắt accondion menu
      //ẩn tên menu
      appName.classList.add("ftms-margin-heade-nav");
      appNamehead.classList.add("ftms-hide-item");
      borderAppName.classList.add("ftms-hide-item");

      let $el = document.querySelectorAll(".ftms-submenu");
      let $elLi = document.querySelectorAll(".ftms-nav-link-group");
      $el.forEach(e => {
        let ele = e as HTMLElement;
        ele.style.display = 'none';
      })
      $elLi.forEach((l) => l.classList.remove("ftms-open"));
      //ẩn hiện tên nav
      // this.removeNavName();
      //cho padding về 0 
      navLink.forEach((l) => l.classList.add("ftms-show-padding0"));
      //hover link tiem
      navLinkGroup.forEach((l) => l.classList.add("ftms-nav-link-item"));
    } else {
      //trạng thái true nếu hiển thị full 
      if (widthOutput < 768) {
        this.dataService.changeState(false);
        nav.classList.remove("show-leftMenu");
        // change icon
        toggle.classList.add("fa-angle-double-right");
        toggle.classList.remove("fa-angle-double-left");
        toggle1.classList.add("fa-angle-double-right");
        toggle1.classList.remove("fa-angle-double-left");
        headerText.classList.add("ftms-hide-item");
        toggle.classList.add("ftms-padding-icon-callap");
        // toggle.classList.add("ftms-padding-icon-callap");
        //tắt accondion menu
        //ẩn tên menu
        appName.classList.add("ftms-margin-heade-nav");
        appNamehead.classList.remove("ftms-hide-item");
        borderAppName.classList.remove("ftms-hide-item");

        let $el = document.querySelectorAll(".ftms-submenu");
        let $elLi = document.querySelectorAll(".ftms-nav-link-group");
        $el.forEach(e => {
          let ele = e as HTMLElement;
          ele.classList.remove("ftms-display-block");
        })
        $elLi.forEach((l) => l.classList.remove("ftms-open"));
        //ẩn hiện tên nav
        // this.removeNavName();
        //cho padding về 0 
        navLink.forEach((l) => l.classList.add("ftms-show-padding0"));
        //hover link tiem
        navLinkGroup.forEach((l) => l.classList.add("ftms-nav-link-item"));
      } else {
        this.dataService.changeState(true);
        nav.classList.add("show-leftMenu");
        toggle.classList.remove("fa-angle-double-right");
        toggle.classList.add("fa-angle-double-left");
        toggle1.classList.remove("fa-angle-double-right");
        toggle1.classList.add("fa-angle-double-left");
        headerText.classList.remove("ftms-hide-item");
        toggle.classList.remove("ftms-padding-icon-callap");
        // toggle.classList.remove("ftms-padding-icon-callap");
        appName.classList.remove("ftms-margin-heade-nav");
        //luôn tắt khi show
        appNamehead.classList.add("ftms-hide-item");
        borderAppName.classList.add("ftms-hide-item");
        //ẩn hiện tên nav
        navName.forEach((l) => l.classList.remove("ftms-hide-item"));
        //cho padding về 0 
        navLink.forEach((l) => l.classList.remove("ftms-show-padding0"));
        //hover link tiem
        navLinkGroup.forEach((l) => l.classList.remove("ftms-nav-link-item"));
        //kiểm tra xem menu cha có active không nếu đang active khi show ra thì show luôn menu
        if (nav.classList.contains("show-leftMenu")) {
          //kiểm tra menu xem cái nào đang active không
          let itemActiveMenu = document.querySelectorAll(".ftms-nav-menu-active")[0];
          if (itemActiveMenu) {
            //kiểm tra xem menu có menu con không nếu có thì add class ftms-open
            itemActiveMenu.parentNode.childNodes.forEach(el => {
              let ele = el as HTMLElement;
              if (ele.classList) {
                if (ele.classList.contains("ftms-submenu")) {
                  let parent = ele.parentNode as HTMLElement;
                  parent.classList.add("ftms-open");
                  ele.style.display = 'block';
                }
              }
            })
          }
        }
      }
    }
  }
  removeNavName() {
    if (document.querySelectorAll(".ftms-nav-name").length == 0) {
      setTimeout(() => {
        this.removeNavName();
      }, 500);
    } else {
      let navName = document.querySelectorAll(".ftms-nav-name");
      navName.forEach((l) => l.classList.add("ftms-hide-item"));
    }
  }
}
